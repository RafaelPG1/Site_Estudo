/* =============================================
   NEXUS STUDY — resumo/js/resumo-busca.js
   Busca de conteúdo (Etapa 2).

   NÃO é um filtro de cards: pesquisa DENTRO dos textos
   das aulas (título, ideia central, título das seções e
   todos os blocos), nos 4 tipos de conteúdo (Resumo,
   Síntese, Resumão, Revisão do professor), sem que esses
   tipos apareçam como botões na área principal — cada
   resultado só indica de qual tipo veio.

   FONTE DE DADOS
   Nenhuma estrutura nova: lê os MESMOS arquivos
   `res_{arquivo}.js` (window.__nexusConteudo =
   {aulas, simplificado, resumao, professor}) que
   resumo-ui.js e resumo-pdf.js já usam. O carregamento
   é sob demanda, uma disciplina por vez, com cache por
   semestre+disciplina. Os textos NÃO são copiados/
   alterados: o índice só guarda uma versão "limpa" e
   normalizada para comparação, e o resultado aponta de
   volta para o objeto original (usado para abrir o leitor).

   ESCOPO
   - "Nesta disciplina" (padrão): usa State.disciplina.
   - "Todas as disciplinas": todas de State.disciplinas
     (o semestre atual); cada resultado mostra a disciplina.

   REGRAS DE CORRESPONDÊNCIA
   - Sem diferenciar maiúsculas/minúsculas nem acentos
     (crc = CRC; funcao = função).
   - Vários termos = todos precisam aparecer no mesmo
     tópico (E lógico, como no Google). Entre aspas
     ("sistema operacional") = expressão exata.
   - O termo casa no INÍCIO de palavras ("prog" acha
     "programação", mas "ip" não acha "tipo").
   - Unidade de resultado = (tipo, aula, tópico). Várias
     ocorrências no mesmo tópico viram UM resultado com
     até 3 trechos (ocorrências próximas dividem trecho).
   - Ordem: relevância (título da aula > título do tópico
     > subtítulo > ideia central > corpo), depois ordem
     natural das aulas.
   ============================================= */

import { resolveIcone, parseSemestre } from '../../src/global.js';
import { playSound } from '../../shared/js/audio/audio-api.js';
import { State, esc } from './resumo-utils.js';
import { abrirResultadoBusca } from './resumo-reader.js';

/* ══════════════════════════════════════════════
   CONSTANTES
══════════════════════════════════════════════ */
const MIN_CHARS     = 2;
const DEBOUNCE_MS   = 220;
const POR_PAGINA    = 40;
const MAX_TRECHOS   = 3;
const JANELA_ANTES  = 70;
const JANELA_DEPOIS = 110;
const AGRUPAR_ATE   = 220;   // ocorrências a menos que isso de distância dividem o mesmo trecho

const TIPOS = {
  completo:  'Resumo',
  sintese:   'Síntese',
  resumao:   'Resumão',
  professor: 'Revisão do professor',
};
const TIPO_ORDEM = ['completo', 'sintese', 'resumao', 'professor'];

// Peso por tipo de campo e teto de ocorrências que contam para o score.
const PESO         = { aula: 12, secao: 8, sub: 5, ideia: 4, corpo: 1 };
const LIMITE_OCORR = { aula: 3,  secao: 3, sub: 3, ideia: 3, corpo: 10 };

/* ══════════════════════════════════════════════
   ESTADO (local ao módulo)
══════════════════════════════════════════════ */
const Busca = {
  escopo:        'disc',          // 'disc' | 'todas'
  query:         '',
  termos:        [],
  frase:         '',
  token:         0,               // invalida buscas assíncronas antigas
  timer:         null,
  resultados:    [],
  visiveis:      0,
  discDaBusca:   null,
  dados:         new Map(),       // `${sem}::${discId}` -> {aulas, simplificado, resumao, professor}
  pending:       new Map(),
  indices:       new Map(),       // `${sem}::${discId}` -> entries[]
  el:            {},
  trocarDisciplina: null,
};

let _fila = Promise.resolve();    // serializa o carregamento (window.__nexusConteudo é global)

/* ══════════════════════════════════════════════
   NORMALIZAÇÃO — mesma posição de caractere (1:1)
   entre o texto original e o normalizado, para
   poder destacar o trecho original pelos índices
   achados no normalizado.
══════════════════════════════════════════════ */
function _norm(str) {
  let out = '';
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch.charCodeAt(0) < 128) { out += ch.toLowerCase(); continue; }
    const b = ch.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    out += b.length === 1 ? b : ch;
  }
  return out;
}

// Remove só a marcação que parseInline() interpreta (**negrito** e `código`)
// e colapsa espaços — o que o leitor mostra, sem símbolos.
function _limpar(s, { codigo = false } = {}) {
  let t = String(s ?? '');
  if (!codigo) t = t.replace(/\*\*(.+?)\*\*/g, '$1').replace(/`([^`]+)`/g, '$1');
  return t.replace(/\s+/g, ' ').trim();
}

const _RE_ALNUM = /[\p{L}\p{N}]/u;

/* ══════════════════════════════════════════════
   CARREGAMENTO — mesma técnica de resumo-pdf.js
══════════════════════════════════════════════ */
function _chave(disc) { return `${State.semestre ?? ''}::${disc.id}`; }

function _carregarDados(disc) {
  const key = _chave(disc);
  if (Busca.dados.has(key))   return Promise.resolve(Busca.dados.get(key));
  if (Busca.pending.has(key)) return Busca.pending.get(key);

  const { ano, periodo, ap } = parseSemestre(State.semestre ?? '2026.1');
  const apPath = ap ? `/${ap}` : '';
  const src = `../content/resumo/${ano}/${periodo}${apPath}/res_${disc.arquivo}.js`;

  const p = _fila.then(() => new Promise(resolve => {
    const script = document.createElement('script');
    script.src = src;
    const finalizar = () => {
      const raw = window.__nexusConteudo ?? null;
      const dados = {
        aulas:        Array.isArray(raw?.aulas)        ? raw.aulas        : [],
        simplificado: Array.isArray(raw?.simplificado) ? raw.simplificado : [],
        resumao:      Array.isArray(raw?.resumao)      ? raw.resumao      : [],
        professor:    Array.isArray(raw?.professor)    ? raw.professor    : [],
      };
      window.__nexusConteudo = null;
      script.remove();
      Busca.dados.set(key, dados);
      Busca.pending.delete(key);
      resolve(dados);
    };
    script.onload  = finalizar;
    script.onerror = finalizar;   // disciplina sem arquivo = sem conteúdo
    document.head.appendChild(script);
  }));

  _fila = p.catch(() => {});
  Busca.pending.set(key, p);
  return p;
}

async function _indiceDe(disc) {
  const key = _chave(disc);
  if (!Busca.indices.has(key)) {
    const dados = await _carregarDados(disc);
    if (!Busca.indices.has(key)) Busca.indices.set(key, _indexar(disc, dados));
  }
  return Busca.indices.get(key);
}

/* ══════════════════════════════════════════════
   INDEXAÇÃO — achata cada tópico em "campos" de texto
   Campo: { t: texto limpo, n: normalizado, kind, sub, codigo }
══════════════════════════════════════════════ */
function _tituloAula(str, idx) {
  const s = String(str ?? '');
  const m = s.match(/^Aula\s*([\d\/]+)\s*[—–-]\s*(.+)$/i);
  if (m) return { num: /^\d+$/.test(m[1]) ? m[1].padStart(2, '0') : m[1], titulo: m[2] };
  return { num: String(idx + 1).padStart(2, '0'), titulo: s };
}

function _campo(texto, kind = 'corpo', sub = '', codigo = false) {
  const t = _limpar(texto, { codigo });
  if (!t) return null;
  return { t, n: _norm(t), kind, sub: sub && sub !== t ? sub : '', codigo };
}

function _camposDaSecao(sec) {
  const campos = [];
  let subAtual = '';                        // último subtítulo visto: contexto dos blocos seguintes
  const add = (texto, kind, sub, codigo) => {
    const c = _campo(texto, kind, sub, codigo);
    if (c) campos.push(c);
  };

  for (const b of sec.blocos ?? []) {
    switch (b?.tipo) {
      case 'topico': {
        const s = _limpar(b.titulo) || subAtual;
        add(b.titulo, 'sub', '');
        add(b.texto, 'corpo', s);
        (b.lista ?? []).forEach(i => add(i, 'corpo', s));
        add(b.codigo, 'corpo', s, true);
        add(b.imagem?.alt, 'corpo', s);
        break;
      }
      case 'imagem':
        add(b.alt, 'corpo', subAtual);
        break;
      case 'lista': {
        const s = _limpar(b.titulo) || subAtual;
        add(b.titulo, 'sub', '');
        (b.itens ?? []).forEach(i => add(i, 'corpo', s));
        break;
      }
      case 'texto':
      case 'destaque':
        add(b.texto, 'corpo', subAtual);
        break;
      case 'subtitulo':
        add(b.texto, 'sub', '');
        subAtual = _limpar(b.texto);
        break;
      case 'exemplo': {
        const s = _limpar(b.titulo) || subAtual;
        add(b.titulo, 'sub', '');
        add(b.texto, 'corpo', s);
        add(b.detalhe, 'corpo', s);
        break;
      }
      case 'tabela': {
        const s = _limpar(b.titulo) || subAtual;
        add(b.titulo, 'sub', '');
        add((b.colunas ?? []).join(' · '), 'corpo', s);
        (b.linhas ?? []).forEach(r => add((r ?? []).join(' · '), 'corpo', s));
        break;
      }
      case 'codigo':
        add(b.codigo, 'corpo', subAtual, true);
        break;
      case 'citacao':
        add(b.texto, 'corpo', subAtual);
        add(b.autor, 'corpo', subAtual);
        break;
      default:
        break;
    }
  }
  return campos;
}

function _indexar(disc, dados) {
  const entries = [];
  const discOrd = Math.max(0, State.disciplinas.findIndex(d => d.id === disc.id));
  const fontes = {
    completo:  dados.aulas,
    sintese:   dados.simplificado,
    resumao:   dados.resumao,
    professor: dados.professor,
  };

  TIPO_ORDEM.forEach((tipo, tOrd) => {
    (fontes[tipo] ?? []).forEach((c, idx) => {
      // Mesmo critério de "tem conteúdo" de renderGrid (resumo-ui.js).
      if (!c || !(c.ideia_central || (c.secoes ?? []).length > 0)) return;

      const tituloBruto = c.aula || dados.aulas[idx]?.aula || '';
      const conteudo    = c.aula ? c : { ...c, aula: tituloBruto };   // só para o leitor; não muta o original
      const { num, titulo } = _tituloAula(tituloBruto, idx);
      const base = { disc, discOrd, tipo, tOrd, idx, num, titulo: _limpar(titulo), conteudo };

      // "Visão geral": título da aula + ideia central
      const geral = [
        _campo(tituloBruto, 'aula'),          // texto completo ("Aula 3 — ...") só para casar
        _campo(c.ideia_central, 'ideia'),
      ].filter(Boolean);
      if (geral.length) entries.push({ ...base, secIdx: -1, secTitulo: '', campos: geral });

      (c.secoes ?? []).forEach((sec, secIdx) => {
        const campos = _camposDaSecao(sec);
        const st = _limpar(sec.titulo);
        const cTit = _campo(sec.titulo, 'secao');
        if (cTit) campos.unshift(cTit);
        if (campos.length) entries.push({ ...base, secIdx, secTitulo: st, campos });
      });
    });
  });
  return entries;
}

/* ══════════════════════════════════════════════
   CORRESPONDÊNCIA
══════════════════════════════════════════════ */
function _interpretar(q) {
  const cru = q.trim();
  const aspas = cru.match(/^["“”](.+?)["“”]$/);
  if (aspas) {
    const f = _norm(aspas[1]).replace(/\s+/g, ' ').trim();
    return { termos: f ? [f] : [], frase: f };
  }
  const f = _norm(cru).replace(/\s+/g, ' ').trim();
  return { termos: [...new Set(f.split(' ').filter(Boolean))], frase: f };
}

// Ocorrências dos termos em `n` (texto normalizado): início de palavra,
// estendidas até o fim da palavra, sobrepostas fundidas.
function _ocorrencias(n, termos) {
  const brutas = [];
  termos.forEach((t, ti) => {
    if (!t) return;
    let pos = n.indexOf(t);
    while (pos !== -1) {
      if (pos === 0 || !_RE_ALNUM.test(n[pos - 1])) {
        let fim = pos + t.length;
        while (fim < n.length && _RE_ALNUM.test(n[fim])) fim++;
        brutas.push({ ini: pos, fim, ti });
      }
      pos = n.indexOf(t, pos + 1);
    }
  });
  brutas.sort((a, b) => a.ini - b.ini || b.fim - a.fim);

  const out = [];
  for (const r of brutas) {
    const ult = out[out.length - 1];
    if (ult && r.ini < ult.fim) {
      if (r.fim > ult.fim) ult.fim = r.fim;
      ult.tis.add(r.ti);
    } else {
      out.push({ ini: r.ini, fim: r.fim, tis: new Set([r.ti]) });
    }
  }
  return out;
}

function _pesquisar(entries, termos, frase) {
  const out = [];
  for (const e of entries) {
    const presentes = new Set();
    const hits = [];
    let score = 0, total = 0, hitsTitulo = 0, temFrase = false;

    e.campos.forEach((c, ci) => {
      const ranges = _ocorrencias(c.n, termos);
      if (!ranges.length) return;
      ranges.forEach(r => r.tis.forEach(t => presentes.add(t)));
      hits.push({ ci, ranges });
      total += ranges.length;
      if (c.kind === 'aula' || c.kind === 'secao') hitsTitulo += ranges.length;
      score += (PESO[c.kind] ?? 1) * Math.min(ranges.length, LIMITE_OCORR[c.kind] ?? 3);
      if (termos.length > 1 && c.n.includes(frase)) temFrase = true;
    });

    if (!hits.length || presentes.size < termos.length) continue;
    if (temFrase) score += 6;
    out.push({ entry: e, score, total, hitsTitulo, hits });
  }

  out.sort((a, b) =>
    b.score - a.score
    || a.entry.discOrd - b.entry.discOrd
    || a.entry.idx - b.entry.idx
    || a.entry.secIdx - b.entry.secIdx
    || a.entry.tOrd - b.entry.tOrd);
  return out;
}

/* ══════════════════════════════════════════════
   TRECHOS + DESTAQUE
══════════════════════════════════════════════ */
function _montarTrechos(res) {
  const { entry, hits } = res;
  const candidatos = [];

  hits.forEach(({ ci, ranges }) => {
    const c = entry.campos[ci];
    // Título da aula / do tópico já aparecem destacados no cabeçalho do card.
    if (c.kind === 'aula' || c.kind === 'secao') return;
    let g = null;
    ranges.forEach(r => {
      if (g && r.fim - g.ini <= AGRUPAR_ATE) {
        g.fim = r.fim; g.ranges.push(r); r.tis.forEach(t => g.tis.add(t));
      } else {
        g = { ci, ini: r.ini, fim: r.fim, ranges: [r], tis: new Set(r.tis) };
        candidatos.push(g);
      }
    });
  });

  const nota = g => g.tis.size * 10 + (PESO[entry.campos[g.ci].kind] ?? 1) + g.ranges.length * 0.1;
  const trechos = candidatos
    .sort((a, b) => nota(b) - nota(a))
    .slice(0, MAX_TRECHOS)
    .sort((a, b) => a.ci - b.ci || a.ini - b.ini);

  // Acerto só no título da aula: mostra o começo da ideia central como contexto.
  if (!trechos.length && entry.secIdx === -1) {
    const ci = entry.campos.findIndex(c => c.kind === 'ideia');
    if (ci !== -1) trechos.push({ ci, ini: 0, fim: Math.min(entry.campos[ci].t.length, 60), ranges: [], tis: new Set() });
  }

  const mostradas = trechos.reduce((s, g) => s + g.ranges.length, 0);
  return { trechos, mostradas };
}

function _htmlTrecho(c, g) {
  const t = c.t;
  let s = Math.max(0, g.ini - JANELA_ANTES);
  if (s > 0) { const sp = t.indexOf(' ', s); if (sp !== -1 && sp < g.ini) s = sp + 1; }
  let e = Math.min(t.length, g.fim + JANELA_DEPOIS);
  if (e < t.length) { const sp = t.lastIndexOf(' ', e); if (sp > g.fim) e = sp; }

  let html = '', cur = s;
  for (const r of g.ranges) {
    html += esc(t.slice(cur, r.ini)) + '<mark class="busca-mark">' + esc(t.slice(r.ini, r.fim)) + '</mark>';
    cur = r.fim;
  }
  html += esc(t.slice(cur, e));
  return (s > 0 ? '…' : '') + html + (e < t.length ? '…' : '');
}

// Destaca os termos em um texto curto (título da aula/tópico).
function _destacar(texto) {
  const rs = _ocorrencias(_norm(texto), Busca.termos);
  if (!rs.length) return esc(texto);
  let html = '', cur = 0;
  for (const r of rs) {
    html += esc(texto.slice(cur, r.ini)) + '<mark class="busca-mark">' + esc(texto.slice(r.ini, r.fim)) + '</mark>';
    cur = r.fim;
  }
  return html + esc(texto.slice(cur));
}

/* ══════════════════════════════════════════════
   RENDER
══════════════════════════════════════════════ */
const _ARROW_SVG = `
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
  </svg>`;

function _plural(n, um, varios) { return `${n} ${n === 1 ? um : varios}`; }

function _htmlResultado(res, i) {
  const e = res.entry;
  const cor = State.DISC_CORES?.[e.disc.arquivo]?.corTema ?? null;
  const discNome = e.disc.apelido ?? e.disc.nome;

  const discChip = Busca.escopo === 'todas' ? `
    <span class="busca-res__disc"${cor ? ` style="--cor-tema:${esc(cor)}"` : ''}>
      ${e.disc.icone ? `<span class="busca-res__disc-ico">${resolveIcone(e.disc.icone)}</span>` : ''}
      <span class="busca-res__disc-nome">${esc(discNome)}</span>
    </span>` : '';

  const rotulo = e.secIdx >= 0 ? `Tópico ${String(e.secIdx + 1).padStart(2, '0')}` : 'Tópico';
  const nomeTopico = e.secIdx >= 0 ? _destacar(e.secTitulo) : 'Visão geral da aula';

  const { trechos, mostradas } = _montarTrechos(res);
  const trechosHtml = trechos.map(g => {
    const c = e.campos[g.ci];
    return `<p class="busca-res__trecho${c.codigo ? ' busca-res__trecho--codigo' : ''}">
      ${c.sub ? `<span class="busca-res__sub">${esc(c.sub)}</span>` : ''}
      <span class="busca-res__texto">${_htmlTrecho(c, g)}</span>
    </p>`;
  }).join('');

  const extra = Math.max(0, res.total - res.hitsTitulo - mostradas);
  const extraHtml = extra > 0
    ? `<div class="busca-res__mais">+ ${_plural(extra, 'ocorrência', 'ocorrências')} ${e.secIdx >= 0 ? 'neste tópico' : 'nesta aula'}</div>`
    : '';

  const aria = `Abrir ${TIPOS[e.tipo]}: ${e.num} — ${e.titulo}${e.secTitulo ? `, tópico ${e.secTitulo}` : ''}`;

  return `
    <article class="busca-res" data-tipo="${e.tipo}" data-i="${i}" tabindex="0" role="button" aria-label="${esc(aria)}">
      <div class="busca-res__topo">
        ${discChip}
        <span class="busca-res__tipo">${esc(TIPOS[e.tipo])}</span>
      </div>
      <div class="busca-res__aula">
        <span class="busca-res__num">${esc(e.num)}</span>
        <span class="busca-res__titulo">${_destacar(e.titulo)}</span>
      </div>
      <div class="busca-res__topico">
        <span class="busca-res__rotulo">${rotulo}</span>
        <span class="busca-res__topico-nome">${nomeTopico}</span>
      </div>
      ${trechosHtml ? `<div class="busca-res__trechos">${trechosHtml}</div>` : ''}
      ${extraHtml}
      <span class="busca-res__seta">${_ARROW_SVG}</span>
    </article>`;
}

function _anexarPagina() {
  const raiz  = Busca.el.resultados;
  const lista = raiz.querySelector('.busca-lista');
  const ate   = Math.min(Busca.resultados.length, Busca.visiveis + POR_PAGINA);
  let html = '';
  for (let i = Busca.visiveis; i < ate; i++) html += _htmlResultado(Busca.resultados[i], i);
  lista.insertAdjacentHTML('beforeend', html);
  Busca.visiveis = ate;

  const restantes = Busca.resultados.length - ate;
  raiz.querySelector('.busca-mais-wrap').innerHTML = restantes > 0
    ? `<button type="button" class="busca-mais" data-mais>Mostrar mais resultados <span>(${restantes} restantes)</span></button>`
    : '';
}

function _renderResultados() {
  const { resultados, status } = Busca.el;
  const res = Busca.resultados;

  const aulas = new Set(res.map(r => `${r.entry.disc.id}::${r.entry.idx}`)).size;
  const discs = new Set(res.map(r => r.entry.disc.id)).size;
  let txt = `<strong>${_plural(res.length, 'resultado', 'resultados')}</strong> para “${esc(Busca.query.trim())}” em ${_plural(aulas, 'aula', 'aulas')}`;
  if (Busca.escopo === 'todas') txt += ` · ${_plural(discs, 'disciplina', 'disciplinas')}`;
  status.innerHTML = txt;

  resultados.innerHTML = '<div class="busca-lista"></div><div class="busca-mais-wrap"></div>';
  Busca.visiveis = 0;
  _anexarPagina();
}

function _renderVazio({ semConteudo }) {
  const { resultados, status } = Busca.el;
  const q = esc(Busca.query.trim());
  const podeTodas = Busca.escopo === 'disc' && State.disciplinas.length > 1;

  status.textContent = '';
  resultados.innerHTML = `
    <div class="busca-vazio">
      <span class="busca-vazio__ico" aria-hidden="true">🔍</span>
      <p>${semConteudo ? 'Ainda não há conteúdo para pesquisar aqui.' : `Nenhum resultado para “${q}”.`}</p>
      <small>${semConteudo ? 'O conteúdo será adicionado em breve.' : 'Confira a grafia ou tente um termo mais curto. A busca ignora maiúsculas e acentos.'}</small>
      ${podeTodas ? '<button type="button" class="busca-vazio__btn" data-buscar-todas>Buscar em todas as disciplinas</button>' : ''}
    </div>`;
}

/* ══════════════════════════════════════════════
   EXECUÇÃO
══════════════════════════════════════════════ */
function _definirAtiva(on) {
  document.body.classList.toggle('busca-ativa', on);
}

function _disciplinasDoEscopo() {
  if (Busca.escopo === 'todas') return State.disciplinas;
  return State.disciplina ? [State.disciplina] : [];
}

async function _executar() {
  clearTimeout(Busca.timer);
  const token = ++Busca.token;
  const q = Busca.query.trim();
  const { status, resultados } = Busca.el;

  if (q.length < MIN_CHARS) {
    _definirAtiva(false);
    Busca.resultados = [];
    resultados.innerHTML = '';
    status.textContent = q.length ? `Digite ao menos ${MIN_CHARS} caracteres para buscar.` : '';
    return;
  }

  const { termos, frase } = _interpretar(q);
  if (!termos.length) return;
  Busca.termos = termos;
  Busca.frase  = frase;
  Busca.discDaBusca = State.disciplina?.id ?? null;
  _definirAtiva(true);

  const discs = _disciplinasDoEscopo();
  const faltando = discs.some(d => !Busca.indices.has(_chave(d)));
  if (faltando) {
    resultados.innerHTML = '';
    status.textContent = 'Buscando…';
  }

  const entries = [];
  for (let i = 0; i < discs.length; i++) {
    if (!Busca.indices.has(_chave(discs[i])) && discs.length > 1) {
      status.textContent = `Carregando conteúdo… ${i + 1}/${discs.length}`;
    }
    const idx = await _indiceDe(discs[i]);
    if (token !== Busca.token) return;
    for (const e of idx) entries.push(e);
  }
  if (token !== Busca.token) return;

  Busca.resultados = _pesquisar(entries, termos, frase);
  if (!entries.length)              _renderVazio({ semConteudo: true });
  else if (!Busca.resultados.length) _renderVazio({ semConteudo: false });
  else                               _renderResultados();
}

// Pré-carrega o conteúdo do escopo atual quando o campo recebe foco,
// para a primeira busca já encontrar tudo em memória.
async function _aquecer() {
  for (const d of _disciplinasDoEscopo()) {
    try { await _indiceDe(d); } catch (_) {}
  }
}

/* ══════════════════════════════════════════════
   ABRIR RESULTADO
══════════════════════════════════════════════ */
function _abrirResultado(res) {
  if (!res) return;
  const e = res.entry;
  if (e.disc.id !== State.disciplina?.id) {
    Busca.trocarDisciplina?.(e.disc, { manterBusca: true });
  }
  abrirResultadoBusca({ tipo: e.tipo, conteudo: e.conteudo, idx: e.idx, secIdx: e.secIdx, termos: Busca.termos });
}
/* ══════════════════════════════════════════════
   API PÚBLICA
══════════════════════════════════════════════ */
export function limparBusca() {
  clearTimeout(Busca.timer);
  Busca.token++;
  Busca.query = '';
  Busca.resultados = [];
  Busca.visiveis = 0;
  const { input, limpar, status, resultados } = Busca.el;
  if (!input) return;
  input.value = '';
  limpar.hidden = true;
  status.textContent = '';
  resultados.innerHTML = '';
  _definirAtiva(false);
}

function _sincronizarEscopoUI() {
  const { escopo } = Busca.el;
  if (!escopo) return;
  escopo.querySelectorAll('[data-escopo]').forEach(btn => {
    const ativo = btn.dataset.escopo === Busca.escopo;
    btn.classList.toggle('busca__escopo-btn--ativo', ativo);
    btn.setAttribute('aria-pressed', String(ativo));
  });
}

/* Chamado quando disciplina/semestre mudam (ver resumo.js). Só atualiza
   rótulos/visibilidade; quem limpa a busca nesses casos é limparBusca(). */
export function atualizarContextoBusca() {
  const { raiz, input, escopo } = Busca.el;
  if (!raiz) return;

  const temDisc = State.disciplinas.length > 0;
  const varias  = State.disciplinas.length > 1;
  raiz.hidden = !temDisc;
  if (!varias) Busca.escopo = 'disc';
  escopo.hidden = !varias;
  _sincronizarEscopoUI();

  const nome = State.disciplina ? (State.disciplina.apelido ?? State.disciplina.nome) : '';
  input.placeholder = Busca.escopo === 'todas'
    ? 'Buscar em todas as disciplinas…'
    : (nome ? `Buscar em ${nome}…` : 'Buscar nos resumos…');
  const btnDisc = escopo.querySelector('[data-escopo="disc"]');
  if (btnDisc) btnDisc.title = nome;

  // Busca por disciplina ainda ativa e a disciplina mudou: refaz para a nova.
  if (document.body.classList.contains('busca-ativa')
      && Busca.escopo === 'disc'
      && State.disciplina?.id !== Busca.discDaBusca) {
    _executar();
  }
}

function _definirEscopo(escopo) {
  if (Busca.escopo === escopo) return;
  playSound('select', 'resumos');
  Busca.escopo = escopo;
  atualizarContextoBusca();
  if (Busca.query.trim().length >= MIN_CHARS) _executar();
  else _aquecer();
}

export function initBusca({ trocarDisciplina } = {}) {
  const raiz = document.getElementById('busca');
  if (!raiz) return;

  Busca.trocarDisciplina = trocarDisciplina ?? null;
  Busca.el = {
    raiz,
    input:      document.getElementById('busca-input'),
    limpar:     document.getElementById('busca-limpar'),
    escopo:     document.getElementById('busca-escopo'),
    status:     document.getElementById('busca-status'),
    resultados: document.getElementById('busca-resultados'),
  };
  const { input, limpar, escopo, resultados } = Busca.el;
  if (!input || !limpar || !escopo || !resultados) return;

  input.addEventListener('input', () => {
    Busca.query = input.value;
    limpar.hidden = !input.value;
    clearTimeout(Busca.timer);
    Busca.timer = setTimeout(_executar, DEBOUNCE_MS);
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); _executar(); }
    else if (e.key === 'Escape' && input.value) { e.preventDefault(); limparBusca(); }
  });
  input.addEventListener('focus', _aquecer);

  limpar.addEventListener('click', () => {
    playSound('click', 'resumos');
    limparBusca();
    input.focus();
  });

  escopo.addEventListener('click', e => {
    const btn = e.target.closest('[data-escopo]');
    if (btn) _definirEscopo(btn.dataset.escopo);
  });

  resultados.addEventListener('click', e => {
    if (e.target.closest('[data-mais]')) {
      playSound('click', 'resumos');
      _anexarPagina();
      return;
    }
    if (e.target.closest('[data-buscar-todas]')) { _definirEscopo('todas'); return; }
    const card = e.target.closest('.busca-res');
    if (card) _abrirResultado(Busca.resultados[Number(card.dataset.i)]);
  });
  resultados.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.busca-res');
    if (!card) return;
    e.preventDefault();
    _abrirResultado(Busca.resultados[Number(card.dataset.i)]);
  });
  resultados.addEventListener('mouseover', e => {
    const card = e.target.closest('.busca-res');
    if (card && card !== e.relatedTarget?.closest?.('.busca-res')) playSound('hover', 'resumos');
  });

  atualizarContextoBusca();
}