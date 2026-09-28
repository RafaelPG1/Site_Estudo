/* =============================================
   NEXUS STUDY — resumo/js/formatador/formatador-storage.js
   Persistência 100% local (IndexedDB). Sem Firebase/rede.

   Dois object stores, de propósito:
     "meta"   → id, titulo, formato, datas, nº de seções, prévia (leve; é o
                que a lista "Meus conteúdos" lê a cada abertura)
     "corpos" → id, texto original, prompt, aula convertida (pesado;
                só lido ao abrir um conteúdo)
   Assim listar nunca carrega textos grandes. Criar um conteúdo
   sempre gera um id novo — nada é sobrescrito. Se o IndexedDB
   estiver indisponível (ex.: navegação privada), cai para memória
   e `persistente()` passa a devolver false para a UI avisar.
   ============================================= */

const DB_NOME = 'nexus-formatador';
const DB_VERSAO = 1;

let _dbPromise = null;
let _usaMemoria = false;
const _memMeta = new Map();
const _memCorpos = new Map();

function _abrir() {
  if (_dbPromise) return _dbPromise;
  _dbPromise = new Promise(resolve => {
    if (!('indexedDB' in window)) { _usaMemoria = true; resolve(null); return; }
    let req;
    try { req = indexedDB.open(DB_NOME, DB_VERSAO); }
    catch (_) { _usaMemoria = true; resolve(null); return; }

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('meta'))   db.createObjectStore('meta',   { keyPath: 'id' });
      if (!db.objectStoreNames.contains('corpos')) db.createObjectStore('corpos', { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = req.onblocked = () => { _usaMemoria = true; resolve(null); };
  });
  return _dbPromise;
}

const _req = r => new Promise((ok, err) => { r.onsuccess = () => ok(r.result); r.onerror = () => err(r.error); });
const _tx  = t => new Promise((ok, err) => { t.oncomplete = () => ok(); t.onerror = t.onabort = () => err(t.error); });

function _novoId() {
  return (crypto.randomUUID?.() ?? `f_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`);
}

function _previa(aula) {
  const base = aula.ideia_central
    ?? aula.secoes?.[0]?.blocos?.find(b => b.texto)?.texto
    ?? '';
  return base.length > 160 ? base.slice(0, 157).trimEnd() + '…' : base;
}

export async function persistente() { await _abrir(); return !_usaMemoria; }

/* Salva um NOVO conteúdo. Devolve o registro meta. */
export async function salvar({ titulo, textoOriginal, prompt, aula, formato, leitura }) {
  const db  = await _abrir();
  const agora = Date.now();
  const meta = {
    id: _novoId(),
    titulo: (titulo ?? '').trim() || aula.aula || 'Sem título',
    criadoEm: agora,
    atualizadoEm: agora,
    formato: (formato ?? '').trim(),
    secoes: aula.secoes?.length ?? 0,
    previa: _previa(aula),
  };
  const corpo = { id: meta.id, textoOriginal: textoOriginal ?? '', prompt: prompt ?? '', leitura: leitura ?? '', aula };

  if (!db) { _memMeta.set(meta.id, meta); _memCorpos.set(meta.id, corpo); return meta; }
  const t = db.transaction(['meta', 'corpos'], 'readwrite');
  t.objectStore('meta').put(meta);
  t.objectStore('corpos').put(corpo);
  await _tx(t);
  return meta;
}

/* Lista só metadados, mais recentes primeiro. */
export async function listar() {
  const db = await _abrir();
  const todos = db
    ? await _req(db.transaction('meta').objectStore('meta').getAll())
    : [..._memMeta.values()];
  return todos.sort((a, b) => b.criadoEm - a.criadoEm);
}

export async function obter(id) {
  const db = await _abrir();
  if (!db) {
    const meta = _memMeta.get(id), corpo = _memCorpos.get(id);
    return meta && corpo ? { ...meta, ...corpo } : null;
  }
  const t = db.transaction(['meta', 'corpos']);
  const [meta, corpo] = await Promise.all([
    _req(t.objectStore('meta').get(id)),
    _req(t.objectStore('corpos').get(id)),
  ]);
  return meta && corpo ? { ...meta, ...corpo } : null;
}

/* Duplicado = mesma estrutura `aula` (título, ideia central, seções e blocos).
   Compara a estrutura normalizada, não o texto colado (espaços/aspas/vírgulas
   mudam sem mudar o conteúdo). O `id` das seções fica de fora: o leitor não o usa. */
function _canon(v) {
  if (Array.isArray(v)) return v.map(_canon);
  if (v && typeof v === 'object') {
    return Object.fromEntries(Object.keys(v).sort().map(k => [k, _canon(v[k])]));
  }
  return v;
}

function _assinatura(aula) {
  const { secoes = [], ...resto } = aula;
  return JSON.stringify(_canon({ ...resto, secoes: secoes.map(({ id, ...sec }) => sec) }));
}

/* Devolve o meta do conteúdo idêntico já salvo, ou null. O pré-filtro por
   título e nº de seções (que vêm da própria estrutura) evita ler corpos à toa;
   a decisão final é sempre a comparação da estrutura completa. */
export async function buscarDuplicado(aula) {
  const alvo = _assinatura(aula);
  const n = aula.secoes?.length ?? 0;
  const candidatos = (await listar()).filter(m => m.titulo === aula.aula && m.secoes === n);
  for (const m of candidatos) {
    const reg = await obter(m.id);
    if (reg?.aula && _assinatura(reg.aula) === alvo) return m;
  }
  return null;
}

export async function remover(id) {
  const db = await _abrir();
  if (!db) { _memMeta.delete(id); _memCorpos.delete(id); return; }
  const t = db.transaction(['meta', 'corpos'], 'readwrite');
  t.objectStore('meta').delete(id);
  t.objectStore('corpos').delete(id);
  await _tx(t);
}