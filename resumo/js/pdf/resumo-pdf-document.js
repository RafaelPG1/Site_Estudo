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

async function _buildItemPdfMake(item, discArquivo, sem, tipoLabel) {
  const { num, titulo } = _splitTitulo(item.aula);
  const secoes = item.secoes ?? [];
  const content = [];

  content.push({
    unbreakable: true,
    margin: [0, 0, 0, 14],
    stack: [
      {
        columns: [
          { text: num || '', color: PDF_COLORS.accent, bold: true, fontSize: 8, width: 'auto' },
          { text: titulo || item.aula || '', bold: true, fontSize: 16, margin: [8, 0, 8, 0] },
          { text: tipoLabel.toUpperCase(), fontSize: 7, color: PDF_COLORS.ink3, alignment: 'right', width: 'auto' },
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

function _buildCapaPdfMake(grupos, tipoLabel) {
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

  const sumario = _buildSumarioPdfMake(grupos);

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

   Hierarquia (ver grupos → itensPorAula/outros vindos de
   resumo-pdf.js::_disciplinasSelecionadasOrdenadas):
     DISCIPLINA
       ├── 01. Aula
       │     • Resumo / Síntese   (recuados, sem número próprio)
       │     ...
       └── OUTROS CONTEÚDOS        (sem número de aula)
             • Resumão / Revisão do professor

   A numeração de aula (01, 02, 03…) reinicia a cada
   disciplina — nunca continua a contagem da disciplina
   anterior. Com mais de uma disciplina selecionada, cada
   bloco ganha também seu próprio número de disciplina
   (1., 2., 3.) para deixar a separação óbvia.
══════════════════════════════════════════════ */
function _buildSumarioPdfMake(grupos) {
  const nodes = [];
  nodes.push({ text: 'SUMÁRIO', bold: true, fontSize: 11, color: PDF_COLORS.accent2, characterSpacing: 1.5, margin: [0, 0, 0, 16] });

  const multiDisc = grupos.length > 1;

  // Entrada de AULA — numerada (01, 02...), com Resumo/Síntese
  // recuados logo abaixo, como subitens dela.
  const pushAula = (n, aulaStr, tiposLabels) => {
    const { num, titulo } = _splitTitulo(aulaStr ?? '');
    const label = titulo || aulaStr || '';
    nodes.push({
      unbreakable: true,
      margin: [0, 0, 0, 9],
      stack: [
        {
          columns: [
            { text: `${String(n).padStart(2, '0')}.`, width: 22, bold: true, fontSize: 9.5, color: PDF_COLORS.accent },
            {
              text: [
                ...(num ? [{ text: `${num} — `, color: PDF_COLORS.ink3 }] : []),
                { text: label, bold: true, fontSize: 9.5 },
              ],
            },
          ],
        },
        { ul: tiposLabels, margin: [22, 3, 0, 0], fontSize: 8.5, color: PDF_COLORS.ink2 },
      ],
    });
  };

  // Entrada de "OUTRO CONTEÚDO" (Resumão / Revisão do professor) —
  // NUNCA numerada como aula (não é "a aula X"): marcador simples +
  // rótulo do tipo, com o título próprio do conteúdo quando houver.
  const pushOutro = (tipoLabel, tituloProprio) => {
    nodes.push({
      margin: [0, 0, 0, 6],
      columns: [
        { text: '—', width: 16, bold: true, fontSize: 9.5, color: PDF_COLORS.accent2 },
        {
          text: tituloProprio
            ? [{ text: `${tipoLabel}`, bold: true, fontSize: 9.5 }, { text: `  ·  ${tituloProprio}`, fontSize: 9.5, color: PDF_COLORS.ink2 }]
            : [{ text: tipoLabel, bold: true, fontSize: 9.5 }],
        },
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

    // Reinicia a numeração de aula a cada disciplina — cada bloco é
    // independente, nunca uma sequência única entre disciplinas.
    let n = 1;
    g.itensPorAula.forEach(aula => {
      const ref = aula.tipos[0]?.item ?? null;
      pushAula(n, ref?.aula, aula.tipos.map(t => TIPO_LABEL[t.tipo]));
      n++;
    });

    // Resumão e Revisão do professor nunca são "a aula X" — são
    // conteúdo independente da disciplina — por isso ganham uma seção
    // própria, sem numeração de aula, separada visualmente das aulas
    // acima.
    if (g.outros.length) {
      nodes.push({
        text: 'OUTROS CONTEÚDOS',
        bold: true, fontSize: 8, color: PDF_COLORS.ink3, characterSpacing: 1,
        margin: [0, g.itensPorAula.length ? 4 : 0, 0, 8],
      });
      g.outros.forEach(o => {
        const { titulo } = _splitTitulo(o.item?.aula ?? '');
        pushOutro(TIPO_LABEL[o.tipo], titulo || o.item?.aula || '');
      });
    }
  });

  return nodes;
}

async function _buildDisciplinaPdfMake(g, sem, headerLabel) {
  const content = [{
    // Todo bloco de disciplina força sua própria quebra de página —
    // inclusive o primeiro. É essa quebra (não mais uma marcação no
    // fim do sumário) que garante que o conteúdo das disciplinas
    // sempre comece em página nova, depois da capa + sumário.
    pageBreak: 'before',
    margin: [0, 0, 0, 24],
    stack: [
      { text: `NEXUS STUDY · ${headerLabel.toUpperCase()}`, color: PDF_COLORS.accent2, bold: true, fontSize: 8, characterSpacing: 1.5 },
      { text: g.disc.nome, bold: true, fontSize: 22, margin: [0, 4, 0, 10] },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 495, y2: 0, lineWidth: 1.2, lineColor: PDF_COLORS.ink1 }] },
    ],
  }];

  // Uma entrada por aula, e dentro dela um bloco por tipo selecionado
  // (na mesma ordem estável de ALL_TIPOS) — mantém as aulas com mais
  // de um tipo selecionado juntas no corpo do PDF, na mesma ordem em
  // que aparecem no sumário da capa.
  for (const aula of g.itensPorAula) {
    for (const { tipo, item } of aula.tipos) {
      const nodes = await _buildItemPdfMake(item, g.disc.arquivo, sem, TIPO_LABEL[tipo]);
      content.push(...nodes);
    }
  }

  // Resumão e Revisão do professor entram DEPOIS, como bloco à parte
  // — não são "mais um tipo da aula X" (ver comentário em
  // resumo-pdf.js::_disciplinasSelecionadasOrdenadas), então nunca
  // são intercalados dentro do loop de aulas acima.
  if (g.outros.length) {
    if (g.itensPorAula.length) {
      content.push({ text: 'OUTROS CONTEÚDOS', bold: true, fontSize: 10, color: PDF_COLORS.accent2, characterSpacing: 1.2, margin: [0, 4, 0, 14] });
    }
    for (const o of g.outros) {
      const nodes = await _buildItemPdfMake(o.item, g.disc.arquivo, sem, TIPO_LABEL[o.tipo]);
      content.push(...nodes);
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

  const content = [..._buildCapaPdfMake(grupos, tituloGeral)];

  for (let gi = 0; gi < grupos.length; gi++) {
    const nodes = await _buildDisciplinaPdfMake(grupos[gi], sem, tituloGeral);
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