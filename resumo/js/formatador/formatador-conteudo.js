/* =============================================
   NEXUS STUDY — resumo/js/formatador/formatador-conteudo.js
   Núcleo da conversão do Formatador (funções puras, sem DOM):

     texto colado (objeto em sintaxe JS)
       1) lerObjeto()        → valor JS (leitor próprio, sem eval)
       2) normalizarAula()   → estrutura que o resumo-reader consome
       3) aulaParaTexto()    → conteúdo de leitura em texto
     converterEstrutura() encadeia as três etapas — é a única
     função exportada e a usada por formatador.js.

   O título é SEMPRE o campo `aula` do que foi colado.
   Formato do leitor (o mesmo de res_*.js):
     { aula, ideia_central?, secoes: [{ id?, titulo, blocos: [ ... ] }] }
   Blocos: topico · texto · subtitulo · lista · exemplo · tabela ·
           codigo · destaque · citacao
   ("imagem" fica de fora de propósito: qualquer bloco de tipo
   desconhecido é descartado e informado em `avisos`.)
   Texto inline aceita **negrito** e `código`.
   ============================================= */


/* ══════════════════════════════════════════════
   1) LEITURA DO OBJETO COLADO — objeto em sintaxe JavaScript → valor JS
   Sem eval/Function: leitor próprio, só de dados. Tolera chaves sem
   aspas, vírgula sobrando, comentários, cerca ```, "const x = {…};"
   e aspas curvas (“ ”), que costumam vir de um copiar/colar.
══════════════════════════════════════════════ */
const ABRE_CURVA = new Set(['“', '”']);
const FECHA_CURVA = new Set(['“', '”', '"']);
const ESC = { n: '\n', t: '\t', r: '\r', b: '\b', f: '\f', v: '\v', 0: '\0' };

class Leitor {
  constructor(s) { this.s = s; this.i = 0; }

  erro(msg) {
    const linha = this.s.slice(0, this.i).split('\n').length;
    throw new Error(`Não consegui ler a estrutura (linha ${linha}): ${msg}`);
  }

  ws() {
    const s = this.s;
    for (;;) {
      const c = s[this.i];
      if (c === undefined) return;
      if (/\s/.test(c) || c === '\uFEFF') { this.i++; continue; }
      if (c === '/' && s[this.i + 1] === '/') { while (this.i < s.length && s[this.i] !== '\n') this.i++; continue; }
      if (c === '/' && s[this.i + 1] === '*') {
        const f = s.indexOf('*/', this.i + 2);
        this.i = f === -1 ? s.length : f + 2; continue;
      }
      return;
    }
  }

  valor() {
    this.ws();
    const c = this.s[this.i];
    if (c === '{') return this.objeto();
    if (c === '[') return this.lista();
    if (c === '"' || c === "'" || c === '`' || ABRE_CURVA.has(c) || c === '‘') return this.texto();
    if (c === '-' || (c >= '0' && c <= '9')) return this.numero();
    const w = /^[A-Za-z_$][\w$]*/.exec(this.s.slice(this.i))?.[0];
    if (w === 'true')  { this.i += 4; return true; }
    if (w === 'false') { this.i += 5; return false; }
    if (w === 'null' || w === 'undefined') { this.i += w.length; return null; }
    if (c === undefined) this.erro('o texto termina antes de a estrutura fechar (falta fechar { ou [ ?).');
    this.erro(`trecho inesperado "${this.s.slice(this.i, this.i + 20).split('\n')[0]}". Textos precisam estar entre aspas.`);
  }

  numero() {
    const m = /^-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/.exec(this.s.slice(this.i));
    if (!m) this.erro('número inválido.');
    this.i += m[0].length;
    return Number(m[0]);
  }

  texto() {
    const abre = this.s[this.i++];
    const curva = ABRE_CURVA.has(abre);
    const fecha = abre === '‘' ? new Set(['’', '‘', "'"]) : curva ? FECHA_CURVA : new Set([abre]);
    let out = '';
    while (this.i < this.s.length) {
      const c = this.s[this.i];
      if (c === '\\') {
        const n = this.s[this.i + 1];
        if (n === 'u' && /^[0-9a-fA-F]{4}$/.test(this.s.slice(this.i + 2, this.i + 6))) {
          out += String.fromCharCode(parseInt(this.s.slice(this.i + 2, this.i + 6), 16)); this.i += 6; continue;
        }
        if (n === '\n') { this.i += 2; continue; }
        out += n in ESC ? ESC[n] : (n ?? ''); this.i += 2; continue;
      }
      if (fecha.has(c)) { this.i++; return out; }
      out += c === '\n' ? ' ' : c;           // quebra de linha solta dentro do texto = espaço
      this.i++;
    }
    this.erro('um texto entre aspas não foi fechado.');
  }

  chave() {
    this.ws();
    const c = this.s[this.i];
    if (c === '"' || c === "'" || ABRE_CURVA.has(c)) return this.texto();
    const m = /^[A-Za-z_$][\w$]*|^\d+/.exec(this.s.slice(this.i));
    if (!m) this.erro(`esperava o nome de um campo, mas encontrei "${(this.s.slice(this.i, this.i + 15) || 'fim do texto').split('\n')[0]}".`);
    this.i += m[0].length;
    return m[0];
  }

  objeto() {
    this.i++;                                  // {
    const obj = {};
    for (;;) {
      this.ws();
      if (this.s[this.i] === '}') { this.i++; return obj; }
      const k = this.chave();
      this.ws();
      if (this.s[this.i] !== ':') this.erro(`faltou ":" depois de "${k}".`);
      this.i++;
      obj[k] = this.valor();
      this.ws();
      if (this.s[this.i] === ',') { this.i++; continue; }
      if (this.s[this.i] === '}') continue;
      if (this.s[this.i] === undefined) this.erro('o texto termina antes de a estrutura fechar (falta fechar { ou [ ?).');
      this.erro(`faltou uma vírgula (ou "}") depois do campo "${k}".`);
    }
  }

  lista() {
    this.i++;                                  // [
    const arr = [];
    for (;;) {
      this.ws();
      if (this.s[this.i] === ']') { this.i++; return arr; }
      arr.push(this.valor());
      this.ws();
      if (this.s[this.i] === ',') { this.i++; continue; }
      if (this.s[this.i] === ']') continue;
      if (this.s[this.i] === undefined) this.erro('o texto termina antes de a estrutura fechar (falta fechar { ou [ ?).');
      this.erro('faltou uma vírgula (ou "]") entre os itens da lista.');
    }
  }
}

/* Texto colado → valor JS. Lança Error em português se não for uma estrutura legível. */
function lerObjeto(entrada) {
  let s = String(entrada ?? '').replace(/\r\n?/g, '\n').trim();
  if (!s) throw new Error('Cole a estrutura do conteúdo antes de formatar.');

  const cerca = s.match(/```[\w-]*\s*\n?([\s\S]*?)```/);
  if (cerca) s = cerca[1].trim();
  s = s.replace(/^[ \t]*[•·▪●◦][ \t]*/gm, '');          // marcadores de lista de quando se copia de um chat

  if (/^aula\s*:/i.test(s)) s = '{' + s.replace(/[,;\s]+$/, '') + '}';   // colou só os campos, sem as chaves
  else {
    const ini = s.search(/[{[]/);
    if (ini === -1) throw new Error('Não encontrei a estrutura do conteúdo. Cole o objeto com os campos aula, ideia_central e secoes.');
    s = s.slice(ini);                                    // descarta "const x =", "export default"…
  }

  const p = new Leitor(s);
  const v = p.valor();
  p.ws();
  while (p.s[p.i] === ';' || p.s[p.i] === ',') { p.i++; p.ws(); }
  if (p.i < s.length) p.erro('sobrou texto depois do fim da estrutura.');
  return v;
}

/* ══════════════════════════════════════════════
   2) VALIDAÇÃO — o que o resumo-reader (_buildReaderBody/_renderBloco)
   já consome. Cada função devolve o bloco limpo ou null (descartado).
   O leitor faz esc()/parseInline() na renderização, então aqui só
   garantimos tipos e campos — não escapamos nada.
══════════════════════════════════════════════ */
const _str = v => (v == null ? '' : String(v)).trim();
const _arrStr = v => (Array.isArray(v) ? v.map(_str).filter(Boolean) : []);

/* ══════════════════════════════════════════════
   NORMALIZAÇÃO DE BLOCOS
   Cada função devolve o bloco limpo ou null (descartado).
   O leitor faz esc()/parseInline() na renderização, então
   aqui só garantimos tipos e campos — não escapamos nada.
══════════════════════════════════════════════ */
const _BLOCOS = {
  topico(b) {
    const out = { tipo: 'topico', titulo: _str(b.titulo) };
    if (_str(b.texto))  out.texto  = _str(b.texto);
    const lista = _arrStr(b.lista ?? b.itens);
    if (lista.length)   out.lista  = lista;
    if (_str(b.codigo)) out.codigo = String(b.codigo).replace(/\s+$/, '');
    return (out.titulo || out.texto || out.lista || out.codigo) ? out : null;
  },
  texto(b)     { const t = _str(b.texto); return t ? { tipo: 'texto', texto: t } : null; },
  subtitulo(b) { const t = _str(b.texto ?? b.titulo); return t ? { tipo: 'subtitulo', texto: t } : null; },
  destaque(b)  { const t = _str(b.texto); return t ? { tipo: 'destaque', texto: t } : null; },
  lista(b) {
    const itens = _arrStr(b.itens ?? b.lista);
    if (!itens.length) return null;
    const out = { tipo: 'lista', itens };
    if (_str(b.titulo)) out.titulo = _str(b.titulo);
    return out;
  },
  exemplo(b) {
    const texto = _str(b.texto);
    if (!texto) return null;
    const out = { tipo: 'exemplo', titulo: _str(b.titulo) || 'Exemplo', texto };
    if (_str(b.detalhe)) out.detalhe = _str(b.detalhe);
    return out;
  },
  tabela(b) {
    const colunas = _arrStr(b.colunas);
    const linhas  = Array.isArray(b.linhas) ? b.linhas.filter(Array.isArray) : [];
    if (!colunas.length || !linhas.length) return null;
    const n = colunas.length;
    // Toda linha com exatamente n células — o leitor não preenche buracos.
    const fix = l => Array.from({ length: n }, (_, i) => _str(l[i]));
    const out = { tipo: 'tabela', colunas, linhas: linhas.map(fix) };
    if (_str(b.titulo)) out.titulo = _str(b.titulo);
    return out;
  },
  codigo(b) {
    const c = String(b.codigo ?? b.texto ?? '').replace(/\s+$/, '');
    return c.trim() ? { tipo: 'codigo', codigo: c } : null;
  },
  citacao(b) {
    const t = _str(b.texto);
    if (!t) return null;
    const out = { tipo: 'citacao', texto: t };
    if (_str(b.autor)) out.autor = _str(b.autor);
    return out;
  },
};

function _normalizarBloco(b) {
  if (!b || typeof b !== 'object') return null;
  const fn = _BLOCOS[_str(b.tipo).toLowerCase()];
  return fn ? fn(b) : null;   // tipo desconhecido (inclui "imagem") → descartado
}

/* Objeto qualquer → aula no formato do leitor. Lança Error com mensagem
   em português quando não há o mínimo para renderizar. `avisos` recebe
   o que foi descartado, para a UI poder informar o usuário. */
function normalizarAula(raw, { tituloPadrao = 'Conteúdo' } = {}) {
  const avisos = [];
  if (!raw || typeof raw !== 'object') throw new Error('A resposta não é um conteúdo válido.');

  const secoesRaw = Array.isArray(raw.secoes) ? raw.secoes : [];
  const secoes = [];
  let descartados = 0;

  secoesRaw.forEach((s, i) => {
    if (!s || typeof s !== 'object') { descartados++; return; }
    const blocos = (Array.isArray(s.blocos) ? s.blocos : [])
      .map(b => { const nb = _normalizarBloco(b); if (!nb) descartados++; return nb; })
      .filter(Boolean);
    if (!blocos.length) { avisos.push(`Seção ${i + 1} sem conteúdo aproveitável foi ignorada.`); return; }
    const sec = { titulo: _str(s.titulo) || `Seção ${secoes.length + 1}`, blocos };
    if (_str(s.id)) sec.id = _str(s.id);   // o leitor não usa; mantém o padrão dos arquivos de conteúdo
    secoes.push(sec);
  });

  if (!secoes.length) throw new Error('Não encontrei nenhuma seção com conteúdo na resposta.');
  if (descartados) avisos.push(`${descartados} bloco${descartados !== 1 ? 's' : ''} em formato não suportado ${descartados !== 1 ? 'foram ignorados' : 'foi ignorado'}.`);

  const aula = { aula: _str(raw.aula ?? raw.titulo) || tituloPadrao, secoes };
  if (_str(raw.ideia_central)) aula.ideia_central = _str(raw.ideia_central);
  return { aula, avisos };
}

/* ══════════════════════════════════════════════
   3) CONTEÚDO DE LEITURA — estrutura do leitor → texto
   Mesma ordem e lógica de _buildReaderBody/_renderBloco e do "Copiar
   aula" (_extractAulaText): título, nº de seções, ideia central e cada
   seção com seus blocos na ordem em que o leitor os exibe.
══════════════════════════════════════════════ */
const bullets = itens => itens.map(i => `- ${i}`).join('\n');
const citar   = linhas => linhas.filter(Boolean).map(l => `> ${l}`).join('\n');

function _bloco(b) {
  switch (b.tipo) {
    case 'topico': {                                   // título → texto → lista → código
      const p = [];
      if (b.titulo) p.push(`**${b.titulo}**`);
      if (b.texto)  p.push(b.texto);
      if (b.lista?.length) p.push(bullets(b.lista));
      if (b.codigo) p.push('```\n' + b.codigo + '\n```');
      return p.join('\n\n');
    }
    case 'texto':     return b.texto;
    case 'subtitulo': return `### ${b.texto}`;
    case 'lista':     return [b.titulo ? `**${b.titulo}**` : '', bullets(b.itens ?? [])].filter(Boolean).join('\n\n');
    case 'exemplo':   return citar([`**${b.titulo || 'Exemplo'}**`, b.texto, b.detalhe]);
    case 'tabela': {
      const cols = b.colunas ?? [];
      const linhas = [
        `| ${cols.join(' | ')} |`,
        `| ${cols.map(() => '---').join(' | ')} |`,
        ...(b.linhas ?? []).map(r => `| ${r.join(' | ')} |`),
      ].join('\n');
      return (b.titulo ? `**${b.titulo}**\n\n` : '') + linhas;
    }
    case 'codigo':    return '```\n' + (b.codigo ?? '') + '\n```';
    case 'destaque':  return citar([b.texto]);
    case 'citacao':   return citar([`“${b.texto}”`, b.autor ? `— ${b.autor}` : '']);
    default:          return '';
  }
}

function aulaParaTexto(aula) {
  const secoes = aula.secoes ?? [];
  const partes = [`# ${aula.aula}`, `${secoes.length} seç${secoes.length !== 1 ? 'ões' : 'ão'}`];
  if (aula.ideia_central) partes.push(`## Ideia central\n\n${aula.ideia_central}`);
  secoes.forEach(s => {
    partes.push(`## ${s.titulo}`);
    (s.blocos ?? []).forEach(b => { const t = _bloco(b); if (t) partes.push(t); });
  });
  return partes.join('\n\n') + '\n';
}

/* ══════════════════════════════════════════════
   4) PONTO DE ENTRADA
══════════════════════════════════════════════ */
/* Texto colado → { aula, avisos, leitura }.
   `aula` é a estrutura validada (é ela que o leitor abre); `leitura` é o
   conteúdo de leitura em texto; `avisos` lista o que foi descartado.
   Lança Error em português quando não há o mínimo para renderizar. */
export function converterEstrutura(entrada) {
  let raw = lerObjeto(entrada);
  if (Array.isArray(raw)) raw = raw[0];
  if (!raw || typeof raw !== 'object') throw new Error('A estrutura colada não é um conteúdo válido.');
  if (typeof raw.aula !== 'string' || !raw.aula.trim()) {
    throw new Error('Não encontrei o campo "aula" (o título do conteúdo) na estrutura colada.');
  }
  const { aula, avisos } = normalizarAula(raw);
  return { aula, avisos, leitura: aulaParaTexto(aula) };
}