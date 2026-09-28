/* =============================================
   NEXUS STUDY — resumo/js/formatador/formatador.js
   Formatador: núcleo + ponto de entrada (usado por resumo.js).
     Prompt          → modelos (Resumo, Resumão, Síntese, …) que definem
                       COMO um conteúdo deve ser organizado; editável.
     Texto           → conteúdo ESTRUTURADO colado pelo usuário
                       ({ aula, ideia_central, secoes }) + "Formatar texto".
     Formatar texto  → converterEstrutura() (seção CONVERSÃO, abaixo) valida
                       o objeto e gera o texto de leitura; salvar()
                       (formatador-storage.js) guarda. O título é o campo
                       `aula`.
     Meus conteúdos  → lateral direita; lista o que foi formatado. Não salva
                       o mesmo conteúdo duas vezes (buscarDuplicado) e permite
                       juntar dois conteúdos em um novo (seção JUNTAR).
                       Clicar abre no resumo-reader EXISTENTE
                       (abrirNoLeitor, abaixo) — não há outro leitor.
   Arquivos: formatador.js (este: controle + conversão + ponte com o leitor)
             formatador-ui.js (marcação, tooltip, confirmação)
             formatador-prompts.js (modelos) · formatador-storage.js (IndexedDB).
   Abre "por cima" da Home via body.tela-formatador (ver
   css/formatador.css); não toca nos modos do Resumo.
   ============================================= */

import { playSound } from '../../../shared/js/audio/audio-api.js';
import { State, esc } from '../resumo-utils.js';
import { abrirModal } from '../resumo-reader.js';
import { MODELOS_PROMPT, garantirEstrutura, extrairEstrutura } from './formatador-prompts.js';
import { montarView, iniciarTooltips, confirmar, htmlVazio, ICONE_LIXO, ICONE_JUNTAR } from './formatador-ui.js';
import { salvar, listar, obter, remover, persistente, buscarDuplicado } from './formatador-storage.js';


const $ = id => document.getElementById(id);

let _montado = false;
let _ocupado = false;
const _statusTimers = {};

async function _copiar(texto) {
  try { await navigator.clipboard.writeText(texto); return true; } catch (_) {}
  try {
    const ta = document.createElement('textarea');
    ta.value = texto; ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy'); ta.remove(); return ok;
  } catch (_) { return false; }
}

function _status(msg, tipo, ms = 2600, id = 'fmt-status') {
  const el = $(id);
  if (!el) return;
  clearTimeout(_statusTimers[id]);
  delete el.dataset.largo;             // "largo" vale só para a mensagem que o pediu (ver aviso de junção duplicada)
  el.textContent = msg;
  el.dataset.tipo = tipo ?? '';
  if (ms && msg) _statusTimers[id] = setTimeout(() => { el.textContent = ''; el.dataset.tipo = ''; }, ms);
}

/* ── Prompt: modelos preenchem o campo com o prompt completo (segue editável) ── */
let _modeloAtivo = null;     // modelo cujo texto foi colocado no campo
let _textoDoModelo = '';     // texto exato colocado — para saber se o usuário editou

function _usarModelo(id) {
  const m = MODELOS_PROMPT.find(x => x.id === id);
  if (!m) return;
  const campo = $('fmt-instrucao');

  // Não perder um prompt que o usuário escreveu/editou sem avisar.
  const atual = campo.value.trim();
  const editado = atual && (!_modeloAtivo || atual !== _textoDoModelo.trim());
  if (editado && !window.confirm('Substituir o prompt atual pelo modelo "' + m.nome + '"?')) return;

  _modeloAtivo = m;
  _textoDoModelo = m.texto;
  campo.value = m.texto;
  campo.scrollTop = 0;

  document.querySelectorAll('.fmt__chip').forEach(b => {
    const on = b.dataset.modelo === id;
    b.classList.toggle('fmt__chip--ativo', on);
    b.setAttribute('aria-pressed', String(on));
  });
  const d = $('fmt-modelo-desc');
  d.textContent = m.desc;
  d.hidden = false;
  _status('');
}

async function _copiarPrompt() {
  const campo = $('fmt-instrucao');
  if (!campo.value.trim()) {
    _status('Escolha um modelo ou escreva seu prompt primeiro.', 'erro');
    campo.focus();
    return;
  }
  // Modelos já trazem a estrutura; um prompt escrito do zero recebe-a ao final.
  const { texto, adicionou } = garantirEstrutura(campo.value);
  const ok = await _copiar(texto);
  _status(
    ok ? (adicionou ? '✓ Copiado. A estrutura do Nexus foi adicionada ao final.' : '✓ Prompt completo copiado.')
       : 'Não foi possível copiar.',
    ok ? 'ok' : 'erro',
    ok ? 3200 : 0
  );
}

async function _copiarEstrutura() {
  const campo = $('fmt-instrucao');
  if (!campo.value.trim()) {
    _status('Escolha um modelo ou escreva seu prompt primeiro.', 'erro');
    campo.focus();
    return;
  }
  const ok = await _copiar(extrairEstrutura(campo.value));
  _status(ok ? '✓ Estrutura copiada.' : 'Não foi possível copiar.', ok ? 'ok' : 'erro', ok ? 3200 : 0);
}

/* ── Texto: entrada + contador ── */
function _atualizarContador() {
  const t = $('fmt-texto').value;
  let palavras = 0, dentro = false;
  for (let i = 0; i < t.length; i++) {          // sem alocar arrays: textos colados podem ser grandes
    const espaco = /\s/.test(t[i]);
    if (!espaco && !dentro) palavras++;
    dentro = !espaco;
  }
  const fmt = n => n.toLocaleString('pt-BR');
  $('fmt-count').textContent =
    `${fmt(palavras)} palavra${palavras !== 1 ? 's' : ''} · ${fmt(t.length)} caractere${t.length !== 1 ? 's' : ''}`;
}

function _ligarCampos() {
  $('fmt-texto').addEventListener('input', _atualizarContador);   // digitar, colar, recortar, desfazer
  // Atalhos globais da página (busca, IA flutuante etc.) não devem "ouvir"
  // o que é digitado aqui: o teclado do campo fica só com o campo.
  ['keydown', 'keyup', 'keypress'].forEach(ev => $('fmt-texto').addEventListener(ev, e => e.stopPropagation()));
  _atualizarContador();                                  // cobre valor restaurado pelo navegador
  _sincronizarAlturas();
}

/* Prompt e Texto sempre com a MESMA altura: o resize nativo de uma caixa
   (só vertical, via CSS) é repassado à outra. */
function _sincronizarAlturas() {
  const a = $('fmt-instrucao'), b = $('fmt-texto');
  if (!a || !b || typeof ResizeObserver === 'undefined') return;
  const ro = new ResizeObserver(entradas => {
    for (const { target } of entradas) {
      const outra = target === a ? b : a;
      const h = target.offsetHeight;
      if (h > 0 && outra.offsetHeight !== h) outra.style.height = h + 'px';
    }
  });
  ro.observe(a);
  ro.observe(b);
}

/* ══════════════════════════════════════════════════════════════
   CONVERSÃO (funções puras, sem DOM)
     texto colado (objeto em sintaxe JS)
       1) lerObjeto()        → valor JS (leitor próprio, sem eval)
       2) normalizarAula()   → estrutura que o resumo-reader consome
       3) aulaParaTexto()    → conteúdo de leitura em texto
     converterEstrutura() encadeia as três etapas e é a usada por _formatar().

   O título é SEMPRE o campo `aula` do que foi colado.
   Formato do leitor (o mesmo de res_*.js):
     { aula, ideia_central?, secoes: [{ id?, titulo, blocos: [ ... ] }] }
   Blocos: topico · texto · subtitulo · lista · exemplo · tabela ·
           codigo · destaque · citacao
   ("imagem" fica de fora de propósito: qualquer bloco de tipo
   desconhecido é descartado e informado em `avisos`.)
   Texto inline aceita **negrito** e `código`.
══════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════
   1) LEITURA DO OBJETO COLADO — objeto em sintaxe JavaScript → valor JS
   Sem eval/Function: leitor próprio, só de dados. Tolera chaves sem
   aspas, vírgula sobrando, comentários, cerca ```, "const x = {…};"
   e aspas curvas (“ ”), que costumam vir de um copiar/colar.
══════════════════════════════════════════════ */
const ABRE_CURVA = new Set(['“', '”']);
const FECHA_CURVA = new Set(['“', '”', '"']);
const ESCAPES = { n: '\n', t: '\t', r: '\r', b: '\b', f: '\f', v: '\v', 0: '\0' };

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
        out += n in ESCAPES ? ESCAPES[n] : (n ?? ''); this.i += 2; continue;
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
function converterEstrutura(entrada) {
  let raw = lerObjeto(entrada);
  if (Array.isArray(raw)) raw = raw[0];
  if (!raw || typeof raw !== 'object') throw new Error('A estrutura colada não é um conteúdo válido.');
  if (typeof raw.aula !== 'string' || !raw.aula.trim()) {
    throw new Error('Não encontrei o campo "aula" (o título do conteúdo) na estrutura colada.');
  }
  const { aula, avisos } = normalizarAula(raw);
  return { aula, avisos, leitura: aulaParaTexto(aula) };
}

/* ── Formatar texto ── */
async function _formatar() {
  if (_ocupado) return;
  const texto = $('fmt-texto');
  const btn = $('fmt-btn-formatar');
  const st = (m, t, ms) => _status(m, t, ms, 'fmt-status-formatar');

  if (!texto.value.trim()) { st('Cole o conteúdo estruturado no campo Texto primeiro.', 'erro'); texto.focus(); return; }

  _ocupado = true;
  btn.disabled = true;
  const rotuloBtn = btn.textContent;
  btn.textContent = 'Formatando…';
  st('');

  try {
    const r = converterEstrutura(texto.value);
    const dup = await buscarDuplicado(r.aula);
    if (dup) {
      await _renderLista(dup.id);          // destaca o que já existe; nada é criado nem alterado
      st(`Este conteúdo já existe em Meus conteúdos: “${dup.titulo}”. Nada foi salvo.`, 'erro', 7000);
      return;
    }
    const meta = await salvar({
      titulo: r.aula.aula,
      textoOriginal: texto.value,
      prompt: $('fmt-instrucao').value,
      aula: r.aula,
      leitura: r.leitura,
      formato: _modeloAtivo?.nome ?? '',   // só o selo no leitor; a estrutura vem pronta na entrada
    });
    await _renderLista(meta.id);

    const aviso = r.avisos?.length ? ' ' + r.avisos.join(' ') : '';
    st(`✓ “${meta.titulo}” foi adicionado a Meus conteúdos.${aviso}`, 'ok', aviso ? 7000 : 4200);
  } catch (err) {
    st(err?.message || 'Não foi possível formatar o texto.', 'erro', 7000);
  } finally {
    _ocupado = false;
    btn.disabled = false;
    btn.textContent = rotuloBtn;
  }
}

/* ── Meus conteúdos ── */

function _data(ms) {
  try { return new Date(ms).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', ''); }
  catch (_) { return ''; }
}

async function _renderLista(novoId) {
  const host = $('fmt-lista');
  if (!host) return;
  let itens = [];
  try { itens = await listar(); } catch (_) {}

  _total = itens.length;
  _selecao = _selecao.filter(id => itens.some(m => m.id === id));
  if (_total < 2) _modoJuntar = false;

  if (!itens.length) {
    host.innerHTML = htmlVazio();
    _atualizarSelecao();
    return;
  }

  let html = itens.map(m => {
    const n = m.secoes ?? 0;
    const meta = [m.formato, `${n} seç${n !== 1 ? 'ões' : 'ão'}`, _data(m.criadoEm)].filter(Boolean).join(' · ');
    return `
      <div class="fmt__item${m.id === novoId ? ' fmt__item--novo' : ''}" data-item="${esc(m.id)}">
        <button type="button" class="fmt__item-abrir" data-fmt="abrir" data-id="${esc(m.id)}" data-tip="${esc(m.previa ?? '')}">
          <span class="fmt__item-titulo">${esc(m.titulo)}</span>
          <span class="fmt__item-meta">${esc(meta)}</span>
          <span class="fmt__item-ordem" hidden></span>
        </button>
        <button type="button" class="fmt__item-del" data-fmt="remover" data-id="${esc(m.id)}" aria-label="Excluir ${esc(m.titulo)}" data-tip="Excluir">${ICONE_LIXO}</button>
      </div>`;
  }).join('');

  if (!(await persistente())) {
    html += `<p class="fmt__vazio fmt__vazio--aviso">O navegador não permite salvar neste modo (ex.: navegação privada): estes conteúdos somem ao recarregar a página.</p>`;
  }
  host.innerHTML = html;
  _atualizarSelecao();
  if (novoId) host.querySelector('.fmt__item--novo')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* Ponte para o leitor EXISTENTE (abrirModal em resumo-reader.js). Nenhuma
   linha do leitor foi alterada: o conteúdo já sai no formato que ele
   consome, então só o "moldamos" ao contexto — o leitor lê State.disciplina
   para o rótulo/eyebrow e a chave do accordion. Trocamos esse campo SÓ
   durante a chamada síncrona de abrirModal() e restauramos em seguida
   (finally), então State nunca fica com a disciplina "falsa".
   rotulo: nome do formato (Resumo, Síntese…) mostrado no selo do leitor. */
const ROTULO_LEITOR = 'Formatador';

function abrirNoLeitor(aula, { rotulo } = {}) {
  const original = State.disciplina;
  // Mantém `arquivo`/demais campos da disciplina real (o leitor os usa
  // para resolver base de imagens); só id/nome mudam.
  State.disciplina = { ...(original ?? {}), id: 'formatador', nome: ROTULO_LEITOR };
  try {
    // idx omitido de propósito: sem ele o leitor não inventa o número
    // grande "1" quando o título não traz "Aula N".
    abrirModal(aula);
  } finally {
    State.disciplina = original;
  }

  // abrirModal() rotula o selo como "Resumo"/"Síntese" conforme State.modo
  // (mesmo ajuste que abrirResultadoBusca faz para os seus tipos).
  const badge = document.getElementById('rm-tipo-badge');
  if (badge) badge.textContent = rotulo || ROTULO_LEITOR;
}

async function _abrirConteudo(id) {
  if (_modoJuntar) { _alternarSelecao(id); return; }
  let reg = null;
  try { reg = await obter(id); } catch (_) {}
  if (!reg?.aula) { _status('Não foi possível abrir este conteúdo.', 'erro', 3500, 'fmt-status-formatar'); return; }
  abrirNoLeitor(reg.aula, { rotulo: reg.formato });
}

async function _removerConteudo(id) {
  const reg = (await listar().catch(() => [])).find(m => m.id === id);
  const ok = await confirmar({
    titulo: 'Excluir conteúdo?',
    destaque: reg?.titulo ?? 'este conteúdo',
    texto: 'Ele será removido de Meus conteúdos. Esta ação não pode ser desfeita.',
    icone: ICONE_LIXO,
    rotuloOk: 'Excluir',
    perigo: true,
  });
  if (!ok) return;
  try { await remover(id); } catch (_) {}
  await _renderLista();
}

/* ══════════════════════════════════════════════
   JUNTAR dois conteúdos em um NOVO (os originais não são tocados)
     1º selecionado vem primeiro, depois o 2º.
     título        → "Título 1 + Título 2"
     ideia_central → as duas, uma após a outra
     seções        → marcador "Conteúdo 1 — título" + seções do 1º, depois
                     marcador "Conteúdo 2 — título" + seções do 2º; blocos
                     intactos; `id` de seção só muda quando colide
     formato       → igual nos dois: mantém; diferente: "Formato 1 + Formato 2"
   Salvar passa pela mesma checagem de duplicado do "Formatar texto".
══════════════════════════════════════════════ */
let _modoJuntar = false;
let _selecao = [];        // ids na ordem em que foram marcados (1º, 2º)
let _total = 0;           // nº de conteúdos na lista

function juntarAulas(a, b) {
  const copia = v => JSON.parse(JSON.stringify(v));           // blocos preservados, sem compartilhar referência
  const secA = copia(a.aula.secoes ?? []);
  const secB = copia(b.aula.secoes ?? []);
  const usados = new Set(secA.map(s => s.id).filter(Boolean));
  secB.forEach(s => {
    if (s.id && usados.has(s.id)) {
      let n = 2;
      while (usados.has(`${s.id}_${n}`)) n++;
      s.id = `${s.id}_${n}`;
    }
    if (s.id) usados.add(s.id);
  });

  /* Marcador de início: uma seção comum (título + 1 bloco "destaque"), o formato que o
     leitor já consome. Assim aparece na lista "Nesta leitura" e como card próprio na
     leitura, sem mexer no leitor. Só as junções ganham marcadores. */
  const marcador = (n, reg, qtd) => {
    let id = `conteudo_${n}`;
    while (usados.has(id)) id += '_';
    usados.add(id);
    return {
      id,
      titulo: `Conteúdo ${n} — ${reg.aula.aula}`,
      divisor: true,   // o leitor exibe só como título com régua, sem número/seta/abrir (ver resumo-reader.js)
      blocos: [{ tipo: 'destaque', texto: `Aqui começa o Conteúdo ${n} de 2 · ${qtd} ${qtd === 1 ? 'seção' : 'seções'}.` }],
    };
  };

  const aula = {
    aula: `${a.aula.aula} + ${b.aula.aula}`,
    secoes: [marcador(1, a, secA.length), ...secA, marcador(2, b, secB.length), ...secB],
  };
  const ideia = [a.aula.ideia_central, b.aula.ideia_central].filter(Boolean).join('\n\n');
  if (ideia) aula.ideia_central = ideia;

  const fa = (a.formato ?? '').trim(), fb = (b.formato ?? '').trim();
  const formato = fa === fb ? fa : [fa, fb].filter(Boolean).join(' + ');
  return { aula, formato };
}

/* Reflete _modoJuntar/_selecao na tela (sem recriar a lista). */
function _atualizarSelecao() {
  const host = $('fmt-lista');
  if (host) {
    host.classList.toggle('fmt__lista--juntar', _modoJuntar);
    host.querySelectorAll('.fmt__item[data-item]').forEach(el => {
      const i = _selecao.indexOf(el.dataset.item);
      el.classList.toggle('fmt__item--sel', i >= 0);
      const tag = el.querySelector('.fmt__item-ordem');
      tag.hidden = i < 0;
      tag.textContent = i >= 0 ? `${i + 1}º` : '';
    });
  }
  const barra = $('fmt-barra');
  if (!barra) return;
  barra.hidden = _total < 2;
  $('fmt-btn-juntar').hidden = _modoJuntar;
  $('fmt-barra-txt').hidden = !_modoJuntar;
  $('fmt-barra-acoes').hidden = !_modoJuntar;
  $('fmt-btn-juntar-ok').disabled = _selecao.length !== 2;
  $('fmt-barra-txt').textContent = _selecao.length === 0 ? 'Escolha o 1º conteúdo na lista.'
    : _selecao.length === 1 ? 'Agora escolha o 2º conteúdo.'
    : 'Pronto: o 1º vem antes do 2º.';
}

function _iniciarJuntar() {
  if (_total < 2) return;
  _modoJuntar = true;
  _selecao = [];
  _status('', '', 0, 'fmt-status-juntar');
  _atualizarSelecao();
}

function _cancelarJuntar() {
  _modoJuntar = false;
  _selecao = [];
  _atualizarSelecao();
}

function _alternarSelecao(id) {
  const i = _selecao.indexOf(id);
  if (i >= 0) _selecao.splice(i, 1);
  else if (_selecao.length >= 2) { _status('Só dois conteúdos por vez. Desmarque um antes.', 'erro', 3000, 'fmt-status-juntar'); return; }
  else _selecao.push(id);
  _atualizarSelecao();
}

async function _juntarConfirmar() {
  if (_ocupado || _selecao.length !== 2) return;
  const st = (m, t, ms) => _status(m, t, ms, 'fmt-status-juntar');
  _ocupado = true;
  try {
    const [a, b] = await Promise.all(_selecao.map(id => obter(id).catch(() => null)));
    if (!a?.aula || !b?.aula) { st('Não foi possível ler um dos conteúdos selecionados.', 'erro', 5000); return; }

    const uniao = juntarAulas(a, b);
    const dup = await buscarDuplicado(uniao.aula);
    if (dup) {
      _cancelarJuntar();
      await _renderLista(dup.id);
      st(`Essa junção já existe em Meus conteúdos: “${dup.titulo}”. Nada foi salvo.`, 'erro', 7000);
      $('fmt-status-juntar').dataset.largo = '1';   // CSS: aviso ocupa a largura da página, não só a coluna lateral
      return;
    }

    const ok = await confirmar({
      titulo: 'Juntar conteúdos?',
      destaque: uniao.aula.aula,
      texto: `“${a.titulo}” vem primeiro, depois “${b.titulo}”. Será criado um novo conteúdo; os dois originais continuam em Meus conteúdos.`,
      icone: ICONE_JUNTAR,
      rotuloOk: 'Juntar',
    });
    if (!ok) return;

    const meta = await salvar({
      titulo: uniao.aula.aula,
      textoOriginal: '',
      prompt: '',
      aula: uniao.aula,
      leitura: aulaParaTexto(uniao.aula),
      formato: uniao.formato,
    });
    _cancelarJuntar();
    await _renderLista(meta.id);
    st(`✓ “${meta.titulo}” foi adicionado a Meus conteúdos.`, 'ok', 5000);
  } catch (err) {
    st(err?.message || 'Não foi possível juntar os conteúdos.', 'erro', 6000);
  } finally {
    _ocupado = false;
  }
}

function _ligar(view) {
  view.addEventListener('click', e => {
    const chip = e.target.closest('[data-modelo]');
    if (chip) { playSound('select', 'resumos'); _usarModelo(chip.dataset.modelo); return; }

    const el = e.target.closest('[data-fmt]');
    const acao = el?.dataset.fmt;
    if (acao === 'voltar') { playSound('click', 'resumos'); fechar(); }
    else if (acao === 'copiar') { playSound('click', 'resumos'); _copiarPrompt(); }
    else if (acao === 'copiar-estrutura') { playSound('click', 'resumos'); _copiarEstrutura(); }
    else if (acao === 'formatar') { playSound('click', 'resumos'); _formatar(); }
    else if (acao === 'abrir') { _abrirConteudo(el.dataset.id); }
    else if (acao === 'juntar-iniciar') { playSound('click', 'resumos'); _iniciarJuntar(); }
    else if (acao === 'juntar-cancelar') { playSound('click', 'resumos'); _cancelarJuntar(); }
    else if (acao === 'juntar-confirmar') { playSound('click', 'resumos'); _juntarConfirmar(); }
    else if (acao === 'remover') { playSound('click', 'resumos'); _removerConteudo(el.dataset.id); }
  });

  _ligarCampos();
}

/* ── API pública (usada por resumo.js) ── */
function _montar() {
  if (_montado) return true;
  const host = $('formatador-view');
  if (!host) return false;
  montarView(host);
  _ligar(host);
  iniciarTooltips(host);
  _renderLista();
  _montado = true;
  return true;
}

export function estaAberto() {
  return document.body.classList.contains('tela-formatador');
}

export function abrir() {
  if (!_montar()) return;
  document.body.classList.add('tela-formatador');
  const bc = $('header-breadcrumb');
  if (bc) bc.innerHTML = 'Resumos <span>· Formatador</span>';
  document.title = 'Formatador — Nexus Study';
  window.scrollTo(0, 0);
}

export function fechar() {
  if (!estaAberto()) return;
  document.body.classList.remove('tela-formatador');
  const bc = $('header-breadcrumb');
  if (bc) bc.textContent = 'Resumos';
  document.title = 'Resumos · Nexus Study';
}

export function initFormatador() {
  const btn = $('btn-abrir-formatador');
  if (!btn) return;
  btn.addEventListener('mouseenter', () => playSound('hover', 'resumos'));
  btn.addEventListener('click', () => { playSound('click', 'resumos'); abrir(); });
}