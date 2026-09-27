/* =============================================
   NEXUS STUDY — resumo/js/pdf/resumo-pdf-document.js
   Construção do CONTEÚDO do PDF (modelo de documento
   pdfmake): paleta, parsing inline, imagens, blocos de
   conteúdo (tópico, lista, tabela, código, destaque,
   citação...), item de aula, capa, sumário, disciplina
   e o docDefinition final — além do carregamento sob
   demanda da biblioteca pdfmake em si.

   Extraído de resumo-pdf.js (que cuida da ORQUESTRAÇÃO:
   seleção na UI do modal, geração e entrega do arquivo)
   para isolar a responsabilidade de "como o PDF é
   montado" de "quando/com quais dados ele é montado".
   Nenhum comportamento foi alterado nesta extração —
   só a localização do código.

   Este módulo NÃO lê PdfState (estado de seleção do
   modal): recebe tudo já resolvido via parâmetros
   (grupos, tiposAtivos), o que o deixa independente da
   UI do modal e mais fácil de acompanhar isoladamente.
   ============================================= */

import { parseSemestre } from '../../../src/global.js';
import { State } from '../resumo-utils.js';
import { imgBase, imgBasePasta, encodePath } from '../media-config.js';

/* ══════════════════════════════════════════════
   RÓTULOS DE TIPO — fonte única de verdade também usada
   pela UI do modal (resumo-pdf.js importa daqui).
══════════════════════════════════════════════ */
export const TIPO_LABEL = { resumo: 'Resumo', resumao: 'Resumão', sintese: 'Síntese', professor: 'Nota do Professor' };
// Fonte única de verdade para a ORDEM dos tipos (usada na lista de
// seleção do modal, no sumário do PDF e no corpo do PDF) — deriva das
// chaves de TIPO_LABEL em vez de duplicar a lista em outra constante.
export const ALL_TIPOS = Object.keys(TIPO_LABEL);

export function _splitTitulo(str) {
  const s = String(str ?? '');
  const m = s.match(/^(Aula\s*[\d\/]+)\s*[—–-]\s*(.+)$/i);
  return { num: m ? m[1] : '', titulo: m ? m[2] : s };
}

/* ══════════════════════════════════════════════
   PDFMAKE — CARREGAMENTO SOB DEMANDA (CDN)
   Mesma técnica de _loadScript em resumo-utils.js:
   só busca o script se ainda não estiver no DOM, e só
   quando o usuário realmente pedir um PDF.
══════════════════════════════════════════════ */
const PDFMAKE_VERSION = '0.2.23';
const PDFMAKE_BASE = `https://cdnjs.cloudflare.com/ajax/libs/pdfmake/${PDFMAKE_VERSION}/`;

let _pdfMakeLoadPromise = null;

function _loadScriptPdf(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`[Resumo PDF] Falha ao carregar: ${src}`));
    document.head.appendChild(s);
  });
}

export function _carregarPdfMake() {
  if (window.pdfMake?.vfs) return Promise.resolve();
  if (_pdfMakeLoadPromise) return _pdfMakeLoadPromise;

  _pdfMakeLoadPromise = _loadScriptPdf(PDFMAKE_BASE + 'pdfmake.min.js')
    .then(() => _loadScriptPdf(PDFMAKE_BASE + 'vfs_fonts.js'))
    .catch(err => {
      // Sem isso, uma falha pontual de rede/CDN (ex.: ad-blocker,
      // timeout, extensão) ficava guardada aqui pra sempre — todas as
      // tentativas seguintes na mesma aba falhavam na hora, mesmo
      // depois da rede voltar ao normal. Zerando o cache, a próxima
      // chamada tenta carregar o script de novo do zero.
      _pdfMakeLoadPromise = null;
      throw err;
    });

  return _pdfMakeLoadPromise;
}

/* ══════════════════════════════════════════════
   PALETA / TEXTO — equivalente ao que era CSS
══════════════════════════════════════════════ */
const PDF_COLORS = {
  ink1:    '#211f1a',
  ink2:    '#4a463e',
  ink3:    '#8a8478',
  paper:   '#fdfbf6',
  line:    '#e2dccd',
  accent:  '#5f8a5a',
  accent2: '#b3803f',
};

/* Equivalente a parseInline (resumo-utils.js), mas devolvendo
   "runs" de texto do pdfmake em vez de HTML — o PDF não tem DOM,
   então não precisa (nem deve) escapar/injetar HTML aqui. */
function _parsePdfInline(str) {
  const s = String(str ?? '');
  const runs = [];
  const re = /\*\*(.+?)\*\*|`([^`]+)`/g;
  let last = 0, m;
  while ((m = re.exec(s))) {
    if (m.index > last) runs.push({ text: s.slice(last, m.index) });
    if (m[1] !== undefined) {
      runs.push({ text: m[1], bold: true });
    } else {
      runs.push({ text: m[2], fontSize: 9.5, color: PDF_COLORS.ink1 });
    }
    last = re.lastIndex;
  }
  if (last < s.length) runs.push({ text: s.slice(last) });
  return runs.length ? runs : [{ text: '' }];
}

/* ══════════════════════════════════════════════
   IMAGENS — o pdfmake precisa da imagem em base64
   (data URL); busca e converte sob demanda, com cache
   para não baixar a mesma imagem duas vezes. Se a
   imagem falhar (404, CORS etc.), o bloco é omitido
   em vez de quebrar a geração inteira do PDF.
══════════════════════════════════════════════ */
const _imgDataUrlCache = new Map();

// pdfMake só sabe embutir JPEG e PNG nativamente — qualquer outro
// formato (webp, avif, gif, svg...) passa batido pelo fetch/base64
// abaixo, mas derruba a geração do PDF inteiro (sem exceção isolada)
// na hora em que o pdfMake tenta desenhar essa imagem. Por isso,
// blob de outro tipo é redesenhado num <canvas> e reexportado como
// PNG antes de virar data URL.
function _blobParaDataUrlCompativel(blob) {
  const tipo = (blob.type || '').toLowerCase();
  if (tipo === 'image/jpeg' || tipo === 'image/png') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Formato não suportado (ou tipo vazio/desconhecido) — converte via
  // canvas. Se nem o <img> conseguir decodificar (svg quebrado etc.),
  // cai no catch de _imagemParaDataUrl e o bloco é omitido, como já
  // acontecia antes para 404/CORS.
  const blobUrl = URL.createObjectURL(blob);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width  = img.naturalWidth  || img.width;
        canvas.height = img.naturalHeight || img.height;
        canvas.getContext('2d').drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        reject(err);
      } finally {
        URL.revokeObjectURL(blobUrl);
      }
    };
    img.onerror = () => { URL.revokeObjectURL(blobUrl); reject(new Error('img-decode')); };
    img.src = blobUrl;
  });
}

function _imagemParaDataUrl(src) {
  if (_imgDataUrlCache.has(src)) return _imgDataUrlCache.get(src);

  const promise = fetch(src)
    .then(r => { if (!r.ok) throw new Error('img'); return r.blob(); })
    .then(_blobParaDataUrlCompativel)
    .catch(() => null);

  _imgDataUrlCache.set(src, promise);
  return promise;
}

async function _imagemPdfNode(src, alt, num) {
  const dataUrl = await _imagemParaDataUrl(src);
  if (!dataUrl) return null;

  const stack = [];
  if (num) stack.push({ text: `Figura ${num}`, fontSize: 8, bold: true, color: PDF_COLORS.accent2, margin: [0, 0, 0, 4] });
  stack.push({ image: dataUrl, width: 420, alignment: 'center' });
  if (alt) stack.push({ text: alt, fontSize: 8, italics: true, color: PDF_COLORS.ink3, alignment: 'center', margin: [0, 4, 0, 0] });

  return { unbreakable: true, stack, alignment: 'center', margin: [0, 8, 0, 16] };
}

/* ══════════════════════════════════════════════
   MONTAGEM DO DOCUMENTO — mesmo modelo de blocos
   (topico, imagem, lista, texto, subtitulo, exemplo,
   tabela, código, destaque, citação) que o reader usa,
   agora produzindo nós de conteúdo do pdfmake em vez
   de HTML de impressão.
══════════════════════════════════════════════ */
function _imgBasePdf(discArquivo, sem) {
  return imgBase(discArquivo, State.semestre);
}

function _codigoPdfNode(codigo) {
  return {
    unbreakable: true,
    table: { widths: ['*'], body: [[{ text: codigo, fontSize: 8.5, color: '#e8e4d8', preserveLeadingSpaces: true }]] },
    layout: {
      hLineWidth: () => 0, vLineWidth: () => 0,
      fillColor: () => '#20241c',
      paddingLeft: () => 12, paddingRight: () => 12, paddingTop: () => 10, paddingBottom: () => 10,
    },
    margin: [0, 6, 0, 14],
  };
}

async function _renderBlocoPdfMake(b, discArquivo, sem) {
  switch (b.tipo) {
    case 'topico': {
      const stack = [];
      if (b.titulo) stack.push({ text: b.titulo, bold: true, fontSize: 11, margin: [0, 0, 0, 4] });
      if (b.texto)  stack.push({ text: _parsePdfInline(b.texto), margin: [0, 0, 0, 8] });
      if (b.imagem) {
        const img = await _imagemPdfNode(_imgBasePdf(discArquivo, sem) + encodePath(b.imagem.src), b.imagem.alt);
        if (img) stack.push(img);
      }
      if (b.lista)  stack.push({ ul: b.lista.map(i => ({ text: _parsePdfInline(i) })), margin: [0, 4, 0, 4] });
      if (b.codigo) stack.push(_codigoPdfNode(b.codigo));
      return stack.length ? { stack, margin: [0, 0, 0, 10] } : null;
    }

    case 'imagem': {
      const base = b.pasta
        ? imgBasePasta(b.pasta, State.semestre)
        : _imgBasePdf(discArquivo, sem);
      return _imagemPdfNode(base + encodePath(b.src), b.alt, b.num);
    }

    case 'lista': {
      const stack = [];
      if (b.titulo) stack.push({ text: _parsePdfInline(b.titulo), bold: true, margin: [0, 0, 0, 4] });
      stack.push({ ul: (b.itens ?? []).map(i => ({ text: _parsePdfInline(i) })) });
      return { stack, margin: [0, 0, 0, 14] };
    }

    case 'texto':
      return { text: _parsePdfInline(b.texto ?? ''), margin: [0, 0, 0, 10] };

    case 'subtitulo':
      return { text: _parsePdfInline(b.texto ?? ''), bold: true, fontSize: 11.5, margin: [0, 14, 0, 6] };

    case 'exemplo': {
      const inner = [];
      if (b.titulo) inner.push({ text: String(b.titulo).toUpperCase(), bold: true, fontSize: 7, color: PDF_COLORS.accent2, margin: [0, 0, 0, 4] });
      inner.push({ text: _parsePdfInline(b.texto ?? '') });
      if (b.detalhe) inner.push({ text: _parsePdfInline(b.detalhe), fontSize: 8, color: PDF_COLORS.ink3, margin: [0, 4, 0, 0] });
      return {
        unbreakable: true,
        table: { widths: ['*'], body: [[{ stack: inner }]] },
        layout: {
          hLineWidth: () => 0.6, vLineWidth: () => 0.6,
          hLineColor: () => PDF_COLORS.line, vLineColor: () => PDF_COLORS.line,
          fillColor: () => '#f6f4ec',
          paddingLeft: () => 12, paddingRight: () => 12, paddingTop: () => 8, paddingBottom: () => 8,
        },
        margin: [0, 6, 0, 14],
      };
    }

    case 'tabela': {
      const cols = b.colunas ?? [];
      const rows = b.linhas  ?? [];
      const body = [
        cols.map(c => ({ text: c, bold: true, fillColor: '#f1efe4' })),
        ...rows.map(r => r.map(c => ({ text: _parsePdfInline(c) }))),
      ];
      const stack = [];
      if (b.titulo) stack.push({ text: b.titulo, bold: true, margin: [0, 0, 0, 4] });
      stack.push({
        unbreakable: true,
        table: { headerRows: 1, widths: cols.map(() => '*'), body },
        layout: {
          hLineColor: () => PDF_COLORS.line, vLineColor: () => PDF_COLORS.line,
          hLineWidth: () => 0.6, vLineWidth: () => 0.6,
        },
      });
      return { stack, margin: [0, 6, 0, 14] };
    }

    case 'codigo':
      return _codigoPdfNode(b.codigo ?? '');

    case 'destaque':
      return {
        unbreakable: true,
        table: { widths: ['*'], body: [[{ text: _parsePdfInline(b.texto ?? '') }]] },
        layout: {
          hLineWidth: () => 0, vLineWidth: (i) => (i === 0 ? 3 : 0),
          vLineColor: () => PDF_COLORS.accent2,
          fillColor: () => '#fbf0dd',
          paddingLeft: () => 12, paddingRight: () => 12, paddingTop: () => 8, paddingBottom: () => 8,
        },
        margin: [0, 6, 0, 14],
      };

    case 'citacao': {
      const inner = [{ text: _parsePdfInline(b.texto ?? ''), italics: true, color: PDF_COLORS.ink2 }];
      if (b.autor) inner.push({ text: b.autor, fontSize: 8, color: PDF_COLORS.ink3, margin: [0, 4, 0, 0] });
      return {
        table: { widths: ['*'], body: [[{ stack: inner }]] },
        layout: {
          hLineWidth: () => 0, vLineWidth: (i) => (i === 0 ? 2 : 0),
          vLineColor: () => PDF_COLORS.ink3,
          paddingLeft: () => 12, paddingRight: () => 4, paddingTop: () => 4, paddingBottom: () => 4,
        },
        margin: [0, 6, 0, 14],
      };
    }

    default:
      return null;
  }
}

/* `opts.mostrarTipoLabel` esconde o selo de tipo no canto (RESUMO /
   SÍNTESE...) quando a disciplina já tem um cabeçalho de MODO acima
   deste item (ver _buildDisciplinaPdfMake) — evita repetir a mesma
   informação duas vezes. Com um único modo ativo (sem cabeçalho de
   MODO), o selo continua aparecendo, como sempre apareceu. */
async function _buildItemPdfMake(item, discArquivo, sem, tipoLabel, opts = {}) {
  const { mostrarTipoLabel = true, numeroAula } = opts;
  // _splitTitulo só serve aqui pra tirar um eventual prefixo "Aula NN"
  // que já viesse embutido no texto de item.aula (mesmo parsing de
  // sempre) — o número exibido no cabeçalho, abaixo, não vem mais
  // daqui: vem de `numeroAula`, recebido pronto de
  // _buildDisciplinaPdfMake (a mesma numeração que o Sumário já usa
  // para este item, nunca uma contagem nova).
  const { titulo } = _splitTitulo(item.aula);

  const secoes = item.secoes ?? [];
  const content = [];

  // Cabeçalho da aula — "Aula NN — Título" como uma linha só, no
  // mesmo tamanho/peso, pra deixar óbvio (sem virar caixa/selo extra)
  // onde cada aula começa dentro do conteúdo do PDF. A linha fina
  // logo abaixo, que já existia, continua sendo o único elemento de
  // separação.
  const numeroFmt = String(numeroAula ?? '').padStart(2, '0');
  content.push({
    unbreakable: true,
    margin: [0, 0, 0, 14],
    stack: [
      {
        columns: [
          {
            width: '*',
            fontSize: 16,
            bold: true,
            text: [
              { text: `Aula ${numeroFmt} — `, color: PDF_COLORS.accent },
              { text: titulo || item.aula || '', color: PDF_COLORS.ink1 },
            ],
          },
          ...(mostrarTipoLabel ? [{ text: tipoLabel.toUpperCase(), fontSize: 7, color: PDF_COLORS.ink3, alignment: 'right', width: 'auto', margin: [8, 5, 0, 0] }] : []),
        ],
      },
      { canvas: [{ type: 'line', x1: 0, y1: 6, x2: 495, y2: 6, lineWidth: 0.6, lineColor: PDF_COLORS.line }] },
    ],
  });

  if (item.ideia_central) {
    content.push({
      unbreakable: true,
      table: { widths: ['*'], body: [[{ text: ['💡 ', ..._parsePdfInline(item.ideia_central)] }]] },
      layout: {
        hLineWidth: () => 0, vLineWidth: (i) => (i === 0 ? 3 : 0),
        vLineColor: () => PDF_COLORS.accent,
        fillColor: () => '#f1efe4',
        paddingLeft: () => 12, paddingRight: () => 12, paddingTop: () => 8, paddingBottom: () => 8,
      },
      margin: [0, 0, 0, 16],
    });
  }

  for (let i = 0; i < secoes.length; i++) {
    const sec = secoes[i];
    content.push({
      unbreakable: true,
      margin: [0, 0, 0, 10],
      columns: [
        {
          width: 'auto',
          table: { body: [[{ text: String(i + 1).padStart(2, '0'), color: '#ffffff', bold: true, fontSize: 7 }]] },
          layout: {
            hLineWidth: () => 0, vLineWidth: () => 0,
            fillColor: () => PDF_COLORS.accent,
            paddingLeft: () => 5, paddingRight: () => 5, paddingTop: () => 3, paddingBottom: () => 3,
          },
        },
        { text: sec.titulo ?? '', bold: true, fontSize: 12, margin: [8, 2, 0, 0] },
      ],
    });

    for (const b of (sec.blocos ?? [])) {
      const node = await _renderBlocoPdfMake(b, discArquivo, sem);
      if (node) content.push(node);
    }
  }

  return content;
}

function _itensDaDisciplina(g) {
  return g.itensPorAula.reduce((n, a) => n + a.tipos.length, 0) + g.outros.length;
}

function _buildCapaPdfMake(grupos, tipoLabel, modosPorGrupo) {
  const totalItens = grupos.reduce((n, g) => n + _itensDaDisciplina(g), 0);
  const dataGeracao = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  const linhas = grupos.map(g => {
    const n = _itensDaDisciplina(g);
    return [
      { text: g.disc.nome, bold: true, margin: [0, 6, 0, 6] },
      { text: `${n} ite${n !== 1 ? 'ns' : 'm'}`, color: PDF_COLORS.ink3, alignment: 'right', margin: [0, 6, 0, 6] },
    ];
  });

  const capa = {
    // Layout original preservado à risca — a margem grande no topo
    // (220) é o que dá o respiro de "capa" antes do título; nenhum
    // elemento existente foi tocado. A quebra para a página das
    // disciplinas não é forçada aqui (ver _buildDisciplinaPdfMake).
    margin: [0, 220, 0, 0],
    stack: [
      { text: 'NEXUS STUDY', color: PDF_COLORS.accent, bold: true, fontSize: 10, characterSpacing: 2, alignment: 'center', margin: [0, 0, 0, 10] },
      { text: tipoLabel, bold: true, fontSize: 34, alignment: 'center', margin: [0, 0, 0, 8] },
      {
        text: `${State.semestre ?? ''} · ${totalItens} ite${totalItens !== 1 ? 'ns' : 'm'} · ${grupos.length} disciplina${grupos.length !== 1 ? 's' : ''}`,
        color: PDF_COLORS.ink2, fontSize: 10, alignment: 'center', margin: [0, 0, 0, 40],
      },
      {
        table: { widths: ['*', 'auto'], body: linhas },
        layout: {
          hLineWidth: (i) => (i === 0 ? 0 : 1), vLineWidth: () => 0,
          hLineColor: () => PDF_COLORS.line,
          paddingLeft: () => 0, paddingRight: () => 0,
        },
        margin: [60, 0, 60, 0],
      },
      { text: `Gerado em ${dataGeracao}`, color: PDF_COLORS.ink3, fontSize: 8, alignment: 'center', margin: [0, 40, 0, 0] },
    ],
  };

  const sumario = _buildSumarioPdfMake(grupos, modosPorGrupo);

  // A quebra de página deixa de ser forçada AQUI (no fim do sumário) —
  // anexá-la a um nó "unbreakable" perto do fim da página é o que
  // gerava uma página em branco extra no pdfmake. Em vez disso, quem
  // força a quebra agora é o próprio bloco de cada disciplina (ver
  // _buildDisciplinaPdfMake: todo bloco de disciplina, incluindo o
  // primeiro, nasce com pageBreak:'before') — capa e sumário só
  // fluem normalmente, sem nenhuma marcação de quebra própria.
  return [capa, ...sumario];
}

/* ══════════════════════════════════════════════
   SUMÁRIO — gerado automaticamente a partir dos MESMOS
   grupos (disciplina → aula → tipos) usados para montar
   o corpo do PDF. Nunca lista aula nem tipo que não
   tenham sido realmente incluídos — é a mesma estrutura,
   só formatada como índice.

   SEM números de página: uma tentativa anterior usava
   `id` + `pageReference` do pdfmake pra isso, mas esse
   recurso obriga o pdfmake a rodar uma SEGUNDA passagem
   completa de layout sobre o documento inteiro só pra
   resolver os números — dobrando o tempo de geração — e,
   nesta versão do pdfmake, `id` em nós compostos (stack
   com canvas dentro, usados no cabeçalho de disciplina/
   modo/item) não é resolvido de forma confiável, o que
   gerava o erro "Page reference id not found". Ficou de
   fora por ora: a hierarquia (texto) já resolve a
   localização, que era o pedido original; navegação por
   página pode voltar depois, se for demonstrado que não
   pesa na geração.
══════════════════════════════════════════════ */
function _agruparPorModo(g) {
  const porTipo = new Map(); // tipo -> [{ idx, item }], nesta ordem

  g.itensPorAula.forEach(a => {
    a.tipos.forEach(({ tipo, item }) => {
      if (!porTipo.has(tipo)) porTipo.set(tipo, []);
      porTipo.get(tipo).push({ idx: a.idx, item });
    });
  });

  g.outros.forEach(o => {
    if (!porTipo.has(o.tipo)) porTipo.set(o.tipo, []);
    porTipo.get(o.tipo).push({ idx: o.idx, item: o.item });
  });

  return ALL_TIPOS
    .filter(tipo => porTipo.has(tipo))
    .map(tipo => ({ tipo, itens: porTipo.get(tipo) }));
}

// `modosPorGrupo` vem pronto de _buildDocDefinition (um só cálculo de
// _agruparPorModo por disciplina, reaproveitado aqui e no corpo do
// PDF — ver comentário em _buildDocDefinition).
function _buildSumarioPdfMake(grupos, modosPorGrupo) {
  const nodes = [];
  nodes.push({ text: 'SUMÁRIO', bold: true, fontSize: 11, color: PDF_COLORS.accent2, characterSpacing: 1.5, margin: [0, 0, 0, 16] });

  const multiDisc = grupos.length > 1;

  // Cabeçalho de MODO — agora aparece SEMPRE, mesmo com um único modo
  // selecionado, pra manter a hierarquia do Sumário sempre constante
  // (DISCIPLINA → MODO → AULA, nunca DISCIPLINA → AULA direto).
  const pushModo = (tipo, primeiro) => {
    nodes.push({
      text: `Modo: ${TIPO_LABEL[tipo]}`,
      bold: true, fontSize: 9.5, color: PDF_COLORS.accent2,
      margin: [0, primeiro ? 4 : 16, 0, 8],
    });
  };

  // Entrada de aula — numerada sequencialmente (01, 02, 03...) na
  // ordem real em que já vem em `modo.itens` (mesma ordem de idx
  // usada no corpo do PDF, nunca uma ordem inventada aqui). O número
  // reinicia a cada modo, igual reiniciava a cada disciplina antes —
  // mesmo estilo visual do Sumário anterior (número em destaque +
  // título ao lado), só que agora sempre aninhada sob o Modo — por
  // isso o recuo abaixo do Modo também é sempre aplicado (a
  // hierarquia Disciplina → Modo → Aula deixou de ser condicional).
  const pushAula = (n, aulaStr) => {
    const { titulo } = _splitTitulo(aulaStr ?? '');
    const label = titulo || aulaStr || '';
    nodes.push({
      margin: [6, 0, 0, 6],
      columns: [
        { text: `${String(n).padStart(2, '0')}.`, width: 22, bold: true, fontSize: 9.5, color: PDF_COLORS.accent },
        { text: label, bold: true, fontSize: 9.5 },
      ],
    });
  };

  grupos.forEach((g, gi) => {
    if (multiDisc) {
      nodes.push({
        text: `${gi + 1}. ${g.disc.nome}`,
        bold: true, fontSize: 11.5, color: PDF_COLORS.ink1,
        margin: [0, gi === 0 ? 0 : 18, 0, 8],
      });
    }

    const modos = modosPorGrupo[gi];

    modos.forEach((modo, mi) => {
      pushModo(modo.tipo, mi === 0);

      // Reinicia a numeração a cada modo — cada bloco é independente,
      // nunca uma sequência única entre modos ou entre disciplinas.
      let n = 1;
      modo.itens.forEach(({ item }) => {
        pushAula(n, item?.aula);
        n++;
      });
    });
  });

  return nodes;
}

/* Cabeçalho de MODO — a divisão intermediária entre disciplina e
   aula (DISCIPLINA → MODO → AULA). Só é inserida quando a disciplina
   tem mais de um modo selecionado (ver `multiModo` abaixo): com um
   único modo ativo não há troca de modo pra sinalizar, então essa
   linha extra seria só ruído — o selo de tipo no canto de cada item
   (ver _buildItemPdfMake) já basta nesse caso, como sempre bastou.
   Visualmente mais forte que a linha fina do cabeçalho de aula (cor
   de destaque, texto maior), mas mais leve que a quebra de página +
   título de 22pt da disciplina — mantendo a disciplina como a maior
   divisão do documento (pageBreak, só ela). */
function _modoHeaderNode(tipo) {
  return {
    unbreakable: true,
    margin: [0, 22, 0, 16],
    stack: [
      { text: 'MODO', fontSize: 7, bold: true, color: PDF_COLORS.ink3, characterSpacing: 1.5, margin: [0, 0, 0, 3] },
      { text: TIPO_LABEL[tipo], bold: true, fontSize: 16, color: PDF_COLORS.accent2 },
      { canvas: [{ type: 'line', x1: 0, y1: 8, x2: 495, y2: 8, lineWidth: 1.1, lineColor: PDF_COLORS.accent2 }] },
    ],
  };
}

// `modos` vem pronto (já calculado por _buildDocDefinition) — esta
// função não chama mais _agruparPorModo por conta própria.
async function _buildDisciplinaPdfMake(g, sem, headerLabel, modos) {
  const content = [{
    // Todo bloco de disciplina força sua própria quebra de página —
    // inclusive o primeiro. É essa quebra (não mais uma marcação no
    // fim do sumário) que garante que o conteúdo das disciplinas
    // sempre comece em página nova, depois da capa + sumário. É
    // também a maior divisão estrutural do documento — nenhum outro
    // nível (modo, aula) força quebra de página.
    pageBreak: 'before',
    margin: [0, 0, 0, 24],
    stack: [
      { text: `NEXUS STUDY · ${headerLabel.toUpperCase()}`, color: PDF_COLORS.accent2, bold: true, fontSize: 8, characterSpacing: 1.5 },
      { text: g.disc.nome, bold: true, fontSize: 22, margin: [0, 4, 0, 10] },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 495, y2: 0, lineWidth: 1.2, lineColor: PDF_COLORS.ink1 }] },
    ],
  }];

  // DISCIPLINA → MODO → AULA: os mesmos itens (itensPorAula + outros)
  // já vêm agrupados por modo, na ordem estável de ALL_TIPOS — Resumo
  // e Síntese primeiro (se ambos ativos), Resumão e Nota do professor
  // depois, cada um na sua própria seção. Dentro de cada modo, a
  // ordem das aulas é a mesma de sempre (itensPorAula, por idx).
  const multiModo = modos.length > 1;

  for (const modo of modos) {
    if (multiModo) content.push(_modoHeaderNode(modo.tipo));
    // Mesmo número que o Sumário já mostra para este item: contagem
    // sequencial dentro do modo, reiniciada a cada modo, na mesma
    // ordem de modo.itens (ver pushAula em _buildSumarioPdfMake, que
    // percorre este mesmo array). Não é uma contagem nova/paralela —
    // é a mesma numeração de aula que o resto do PDF já usa.
    let numeroAula = 1;
    for (const { item } of modo.itens) {
      const nodes = await _buildItemPdfMake(item, g.disc.arquivo, sem, TIPO_LABEL[modo.tipo], {
        mostrarTipoLabel: !multiModo,
        numeroAula,
      });
      content.push(...nodes);
      numeroAula++;
    }
  }

  return content;
}

/* `tiposAtivos` é passado pronto por resumo-pdf.js (mesmo filtro de
   antes: `ALL_TIPOS.filter(t => PdfState.tipos.has(t))`) — este
   módulo não lê PdfState diretamente, só recebe o resultado já
   calculado. Mesmo valor, mesma ordem, mesmo resultado de sempre. */
export async function _buildDocDefinition(grupos, tiposAtivos) {
  const { ano, periodo, ap } = parseSemestre(State.semestre ?? '2026.1');
  const sem = { ano, periodo, apPath: ap ? `/${ap}` : '' };

  // Com 1 tipo só ativo, título = exatamente o rótulo daquele tipo
  // (comportamento idêntico ao anterior). Com mais de um tipo
  // selecionado, "Resumo"/"Síntese"/etc. sozinho não descreveria o
  // conteúdo misto — usa um título genérico; o sumário logo abaixo
  // já mostra exatamente quais tipos entraram em cada aula.
  const tituloGeral = tiposAtivos.length === 1 ? TIPO_LABEL[tiposAtivos[0]] : 'Resumos';

  // _agruparPorModo roda UMA VEZ por disciplina aqui (era chamada
  // duas vezes antes: uma no Sumário, outra no corpo) e o resultado é
  // reaproveitado nos dois lugares abaixo — é um cálculo O(nº de
  // itens) por disciplina, não é o que pesava na geração, mas não há
  // motivo pra repeti-lo.
  const modosPorGrupo = grupos.map(g => _agruparPorModo(g));

  const content = [..._buildCapaPdfMake(grupos, tituloGeral, modosPorGrupo)];

  for (let gi = 0; gi < grupos.length; gi++) {
    const nodes = await _buildDisciplinaPdfMake(grupos[gi], sem, tituloGeral, modosPorGrupo[gi]);
    content.push(...nodes);
  }

  return {
    info: { title: `Resumos — ${tituloGeral} · Nexus Study` },
    pageSize: 'A4',
    pageMargins: [51, 57, 51, 57], // ~18mm / 20mm, igual ao @page anterior
    defaultStyle: { fontSize: 10.5, color: PDF_COLORS.ink1, lineHeight: 1.35 },
    background: (_currentPage, pageSize) => ({
      canvas: [{ type: 'rect', x: 0, y: 0, w: pageSize.width, h: pageSize.height, color: PDF_COLORS.paper }],
    }),
    content,
  };
}