/* =============================================
   NEXUS STUDY — resumo/js/resumo-pdf.js
   Geração de PDF a partir do conteúdo já existente
   do Resumo (Resumo completo / Resumão / Síntese).

   Não duplica dado nenhum: reaproveita exatamente a
   mesma fonte que resumo-ui.js usa (script
   `res_{arquivo}.js`, que define
   window.__nexusConteudo = {aulas, simplificado, resumao, professor}),
   só que carregando disciplina por disciplina sob
   demanda (o carregamento normal só busca a
   disciplina ativa) e mantendo um cache local para
   não buscar a mesma disciplina duas vezes.

   GERAÇÃO DO PDF (v2 — pdfmake)
   O documento é montado como uma árvore de conteúdo
   do pdfmake (https://pdfmake.github.io/) e baixado
   direto pelo navegador via `.download()` — sem abrir
   aba nova, sem window.print(), sem diálogo de
   impressão. O texto é real (vetorial, selecionável
   e pesquisável no PDF), não uma imagem/screenshot da
   página. Paginação, margens (20mm/18mm, A4) e blocos
   que não podem ser cortados entre páginas (cabeçalho
   de aula, caixas de destaque, tabelas, figuras) são
   controlados nativamente pelo pdfmake.

   O pdfmake é carregado sob demanda via CDN (cdnjs),
   do mesmo jeito que o resto do projeto já carrega
   scripts externos sob demanda (ver carregarIA() em
   resumo-utils.js) — não precisa de bundler nem de
   dependência nova no projeto.
   ============================================= */

import { resolveIcone, parseSemestre } from '../../src/global.js';
import { playSound } from '../../shared/js/audio/audio-api.js';
import { State, esc } from './resumo-utils.js';

/* ══════════════════════════════════════════════
   ESTADO DO MODAL DE PDF (local a este módulo)
══════════════════════════════════════════════ */
const PdfState = {
  discIds:         new Set(),  // disciplinas selecionadas (por id)
  tipo:            'resumo',   // 'resumo' | 'resumao' | 'sintese' | 'professor'
  tipoInicializado: false,
  aulaSel:         new Set(),  // chaves `${discId}::${idx}` selecionadas
  knownKeys:       new Set(),  // chaves já vistas (para aplicar default = selecionado só 1x)
  cache:           new Map(),  // discId -> { aulas, simplificado, resumao, professor }
  pending:         new Map(),  // discId -> Promise (carregamento em curso)
  loading:         new Set(),  // discIds carregando agora (para UI)
};

function _key(discId, idx) { return `${discId}::${idx}`; }

const TIPO_LABEL = { resumo: 'Resumo', resumao: 'Resumão', sintese: 'Síntese', professor: 'Nota do Professor' };

/* ══════════════════════════════════════════════
   CARREGAMENTO DE CONTEÚDO POR DISCIPLINA
   (mesma técnica de resumo-ui.js::carregarConteudo,
   mas parametrizada por disciplina e sem tocar no
   State principal da página — carregamento sequencial
   evita concorrência no window.__nexusConteudo global.)
══════════════════════════════════════════════ */
function _carregarConteudoDisciplina(disc) {
  if (PdfState.cache.has(disc.id)) return Promise.resolve(PdfState.cache.get(disc.id));
  if (PdfState.pending.has(disc.id)) return PdfState.pending.get(disc.id);

  const { ano, periodo, ap } = parseSemestre(State.semestre ?? '2026.1');
  const apPath = ap ? `/${ap}` : '';
  const src = `../content/resumo/${ano}/${periodo}${apPath}/res_${disc.arquivo}.js`;

  const promise = new Promise(resolve => {
    const script = document.createElement('script');
    script.src = src;

    const finalizar = () => {
      const raw = window.__nexusConteudo ?? null;
      const dados = {
        aulas:        Array.isArray(raw?.aulas)        ? raw.aulas        : [],
        simplificado: Array.isArray(raw?.simplificado) ? raw.simplificado : [],
        resumao:      Array.isArray(raw?.resumao)       ? raw.resumao      : [],
        professor:    Array.isArray(raw?.professor)     ? raw.professor    : [],
      };
      window.__nexusConteudo = null;
      script.remove();
      PdfState.cache.set(disc.id, dados);
      PdfState.pending.delete(disc.id);
      resolve(dados);
    };

    script.onload  = finalizar;
    script.onerror = finalizar;
    document.head.appendChild(script);
  });

  PdfState.pending.set(disc.id, promise);
  return promise;
}

/* ══════════════════════════════════════════════
   ITENS DISPONÍVEIS PARA O TIPO SELECIONADO
   Mesmo critério de "tem conteúdo" usado em
   resumo-ui.js::renderGrid, para o PDF nunca listar
   uma aula/síntese/resumão vazia.
══════════════════════════════════════════════ */
function _getItens(discId, dados) {
  if (!dados) return [];

  if (PdfState.tipo === 'sintese') {
    return dados.aulas
      .map((aula, idx) => {
        const s = dados.simplificado[idx] ?? null;
        const tem = !!(s && (s.ideia_central || (s.secoes ?? []).length > 0));
        return tem ? { idx, item: { aula: aula.aula, ideia_central: s.ideia_central, secoes: s.secoes } } : null;
      })
      .filter(Boolean);
  }

  if (PdfState.tipo === 'resumao') {
    return dados.resumao
      .map((r, idx) => {
        const tem = !!(r && (r.ideia_central || (r.secoes ?? []).length > 0));
        return tem ? { idx, item: r } : null;
      })
      .filter(Boolean);
  }

  if (PdfState.tipo === 'professor') {
    return dados.professor
      .map((p, idx) => {
        const tem = !!(p && (p.ideia_central || (p.secoes ?? []).length > 0));
        return tem ? { idx, item: p } : null;
      })
      .filter(Boolean);
  }

  // 'resumo' — conteúdo completo
  return dados.aulas.map((aula, idx) => ({ idx, item: aula }));
}

function _splitTitulo(str) {
  const s = String(str ?? '');
  const m = s.match(/^(Aula\s*[\d\/]+)\s*[—–-]\s*(.+)$/i);
  return { num: m ? m[1] : '', titulo: m ? m[2] : s };
}

/* ══════════════════════════════════════════════
   RENDER — DISCIPLINAS
══════════════════════════════════════════════ */
function _renderDisciplinas() {
  const wrap = document.getElementById('pdf-disc-list');
  if (!wrap) return;

  if (!State.disciplinas.length) {
    wrap.innerHTML = `<div class="pdf-aulas-empty">Nenhuma disciplina neste semestre.</div>`;
    return;
  }

  wrap.innerHTML = State.disciplinas.map(disc => {
    const checked = PdfState.discIds.has(disc.id);
    return `
      <label class="pdf-disc-item">
        <input type="checkbox" data-disc-id="${esc(disc.id)}" ${checked ? 'checked' : ''}>
        <span class="pdf-disc-item__emoji">${disc.icone ? resolveIcone(disc.icone) : ''}</span>
        <span class="pdf-disc-item__nome">${esc(disc.apelido ?? disc.nome)}</span>
      </label>`;
  }).join('');

  wrap.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      const id = cb.dataset.discId;
      if (cb.checked) PdfState.discIds.add(id); else PdfState.discIds.delete(id);
      _updateDiscAllLabel();
      _refreshAulas();
    });
  });

  _updateDiscAllLabel();
}

function _onDiscAllClick() {
  if (!State.disciplinas.length) return;
  playSound('click', 'resumos');
  const todas = State.disciplinas.every(d => PdfState.discIds.has(d.id));
  if (todas) PdfState.discIds.clear();
  else State.disciplinas.forEach(d => PdfState.discIds.add(d.id));
  _renderDisciplinas();
  _refreshAulas();
}

function _updateDiscAllLabel() {
  const btn = document.getElementById('pdf-disc-all');
  if (!btn) return;
  const todas = State.disciplinas.length > 0 && State.disciplinas.every(d => PdfState.discIds.has(d.id));
  btn.textContent = todas ? 'Remover todas' : 'Selecionar todas';
  btn.disabled = State.disciplinas.length === 0;
}

/* ══════════════════════════════════════════════
   RENDER — TIPO DE CONTEÚDO
══════════════════════════════════════════════ */
function _setTipo(tipo) {
  if (PdfState.tipo === tipo) return;
  playSound('select', 'resumos');
  PdfState.tipo = tipo;
  document.querySelectorAll('#pdf-tipo-list [data-tipo]').forEach(b => {
    b.classList.toggle('pdf-tipo-btn--active', b.dataset.tipo === tipo);
  });
  // O tipo muda o significado do índice de cada item — zera o
  // rastreio de seleção para os defaults recalcularem certo.
  PdfState.knownKeys.clear();
  PdfState.aulaSel.clear();
  _refreshAulas();
}

/* ══════════════════════════════════════════════
   RENDER — AULAS (dependente de disciplinas + tipo)
══════════════════════════════════════════════ */
function _visiveisAulaKeys() {
  const keys = [];
  State.disciplinas.filter(d => PdfState.discIds.has(d.id)).forEach(disc => {
    const dados = PdfState.cache.get(disc.id);
    if (!dados) return;
    _getItens(disc.id, dados).forEach(it => keys.push(_key(disc.id, it.idx)));
  });
  return keys;
}

function _renderAulas() {
  const wrap = document.getElementById('pdf-aulas-list');
  if (!wrap) return;

  const selecionadas = State.disciplinas.filter(d => PdfState.discIds.has(d.id));
  if (!selecionadas.length) {
    wrap.innerHTML = `<div class="pdf-aulas-empty">Selecione ao menos uma disciplina.</div>`;
    _updateFooter();
    _updateAulasAllLabel();
    return;
  }

  let html = '';
  selecionadas.forEach(disc => {
    if (PdfState.loading.has(disc.id)) {
      html += `
        <div class="pdf-aula-grupo">
          <div class="pdf-aula-grupo__titulo">${esc(disc.apelido ?? disc.nome)}</div>
          <div class="pdf-aula-grupo__loading">Carregando conteúdo…</div>
        </div>`;
      return;
    }

    const dados = PdfState.cache.get(disc.id);
    const itens = _getItens(disc.id, dados);

    // Default: item novo nasce selecionado.
    itens.forEach(it => {
      const key = _key(disc.id, it.idx);
      if (!PdfState.knownKeys.has(key)) {
        PdfState.knownKeys.add(key);
        PdfState.aulaSel.add(key);
      }
    });

    if (!itens.length) {
      html += `
        <div class="pdf-aula-grupo">
          <div class="pdf-aula-grupo__titulo">${esc(disc.apelido ?? disc.nome)}</div>
          <div class="pdf-aula-grupo__vazio">Nenhum conteúdo de "${esc(TIPO_LABEL[PdfState.tipo])}" disponível.</div>
        </div>`;
      return;
    }

    html += `
      <div class="pdf-aula-grupo">
        <div class="pdf-aula-grupo__titulo">${esc(disc.apelido ?? disc.nome)}</div>
        ${itens.map((it, i) => {
          const key = _key(disc.id, it.idx);
          const checked = PdfState.aulaSel.has(key);
          const { titulo } = _splitTitulo(it.item.aula);
          const label = `Aula ${i + 1} - ${titulo || it.item.aula || ''}`;
          return `
            <label class="pdf-aula-item">
              <input type="checkbox" data-key="${esc(key)}" ${checked ? 'checked' : ''}>
              <span>${esc(label)}</span>
            </label>`;
        }).join('')}
      </div>`;
  });

  wrap.innerHTML = html;

  wrap.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      const key = cb.dataset.key;
      if (cb.checked) PdfState.aulaSel.add(key); else PdfState.aulaSel.delete(key);
      _updateFooter();
      _updateAulasAllLabel();
    });
  });

  _updateFooter();
  _updateAulasAllLabel();
}

async function _refreshAulas() {
  const pendentes = State.disciplinas.filter(d => PdfState.discIds.has(d.id) && !PdfState.cache.has(d.id));
  pendentes.forEach(d => PdfState.loading.add(d.id));
  _renderAulas();

  for (const disc of pendentes) {
    await _carregarConteudoDisciplina(disc);
    PdfState.loading.delete(disc.id);
    _renderAulas();
  }
}

function _onAulasAllClick() {
  const keys = _visiveisAulaKeys();
  if (!keys.length) return;
  playSound('click', 'resumos');
  const todas = keys.every(k => PdfState.aulaSel.has(k));
  keys.forEach(k => todas ? PdfState.aulaSel.delete(k) : PdfState.aulaSel.add(k));
  _renderAulas();
}

function _updateAulasAllLabel() {
  const btn = document.getElementById('pdf-aulas-all');
  if (!btn) return;
  const keys = _visiveisAulaKeys();
  const todas = keys.length > 0 && keys.every(k => PdfState.aulaSel.has(k));
  btn.textContent = todas ? 'Remover todas' : 'Selecionar todas';
  btn.disabled = keys.length === 0;
}

/* ══════════════════════════════════════════════
   CONTADOR / BOTÃO GERAR
══════════════════════════════════════════════ */
function _contarSelecionadas() {
  let total = 0;
  State.disciplinas.filter(d => PdfState.discIds.has(d.id)).forEach(disc => {
    const dados = PdfState.cache.get(disc.id);
    if (!dados) return;
    _getItens(disc.id, dados).forEach(it => {
      if (PdfState.aulaSel.has(_key(disc.id, it.idx))) total++;
    });
  });
  return total;
}

function _updateFooter() {
  const total   = _contarSelecionadas();
  const countEl = document.getElementById('pdf-modal-count');
  const genBtn  = document.getElementById('pdf-generate-btn');
  if (countEl) {
    countEl.textContent = total === 0
      ? 'Nenhuma aula selecionada'
      : `${total} ite${total !== 1 ? 'ns' : 'm'} selecionado${total !== 1 ? 's' : ''}`;
  }
  if (genBtn) genBtn.disabled = total === 0;
}

function _disciplinasSelecionadasOrdenadas() {
  return State.disciplinas
    .filter(d => PdfState.discIds.has(d.id))
    .map(disc => {
      const dados = PdfState.cache.get(disc.id);
      const itens = _getItens(disc.id, dados).filter(it => PdfState.aulaSel.has(_key(disc.id, it.idx)));
      return { disc, itens };
    })
    .filter(g => g.itens.length > 0);
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

function _carregarPdfMake() {
  if (window.pdfMake?.vfs) return Promise.resolve();
  if (_pdfMakeLoadPromise) return _pdfMakeLoadPromise;

  _pdfMakeLoadPromise = _loadScriptPdf(PDFMAKE_BASE + 'pdfmake.min.js')
    .then(() => _loadScriptPdf(PDFMAKE_BASE + 'vfs_fonts.js'));

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

function _imagemParaDataUrl(src) {
  if (_imgDataUrlCache.has(src)) return _imgDataUrlCache.get(src);

  const promise = fetch(src)
    .then(r => { if (!r.ok) throw new Error('img'); return r.blob(); })
    .then(blob => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }))
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
  return `../content/resumo/${sem.ano}/${sem.periodo}${sem.apPath}/image/imagens_${discArquivo}/`;
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
        const img = await _imagemPdfNode(_imgBasePdf(discArquivo, sem) + b.imagem.src, b.imagem.alt);
        if (img) stack.push(img);
      }
      if (b.lista)  stack.push({ ul: b.lista.map(i => ({ text: _parsePdfInline(i) })), margin: [0, 4, 0, 4] });
      if (b.codigo) stack.push(_codigoPdfNode(b.codigo));
      return stack.length ? { stack, margin: [0, 0, 0, 10] } : null;
    }

    case 'imagem': {
      const base = b.pasta
        ? `../content/resumo/${sem.ano}/${sem.periodo}${sem.apPath}/image/${b.pasta}/`
        : _imgBasePdf(discArquivo, sem);
      return _imagemPdfNode(base + b.src, b.alt, b.num);
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

function _buildCapaPdfMake(grupos, tipoLabel) {
  const totalItens = grupos.reduce((n, g) => n + g.itens.length, 0);
  const dataGeracao = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  const linhas = grupos.map(g => ([
    { text: g.disc.nome, bold: true, margin: [0, 6, 0, 6] },
    { text: `${g.itens.length} ite${g.itens.length !== 1 ? 'ns' : 'm'}`, color: PDF_COLORS.ink3, alignment: 'right', margin: [0, 6, 0, 6] },
  ]));

  return {
    pageBreak: 'after',
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
}

async function _buildDisciplinaPdfMake(g, sem, tipoLabel, isFirst) {
  const content = [{
    pageBreak: isFirst ? undefined : 'before',
    margin: [0, 0, 0, 24],
    stack: [
      { text: `NEXUS STUDY · ${tipoLabel.toUpperCase()}`, color: PDF_COLORS.accent2, bold: true, fontSize: 8, characterSpacing: 1.5 },
      { text: g.disc.nome, bold: true, fontSize: 22, margin: [0, 4, 0, 10] },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 495, y2: 0, lineWidth: 1.2, lineColor: PDF_COLORS.ink1 }] },
    ],
  }];

  for (const { item } of g.itens) {
    const nodes = await _buildItemPdfMake(item, g.disc.arquivo, sem, tipoLabel);
    content.push(...nodes);
  }

  return content;
}

async function _buildDocDefinition(grupos, tipoLabel) {
  const { ano, periodo, ap } = parseSemestre(State.semestre ?? '2026.1');
  const sem = { ano, periodo, apPath: ap ? `/${ap}` : '' };

  const content = [_buildCapaPdfMake(grupos, tipoLabel)];

  for (let gi = 0; gi < grupos.length; gi++) {
    const nodes = await _buildDisciplinaPdfMake(grupos[gi], sem, tipoLabel, gi === 0);
    content.push(...nodes);
  }

  return {
    info: { title: `Resumos — ${tipoLabel} · Nexus Study` },
    pageSize: 'A4',
    pageMargins: [51, 57, 51, 57], // ~18mm / 20mm, igual ao @page anterior
    defaultStyle: { fontSize: 10.5, color: PDF_COLORS.ink1, lineHeight: 1.35 },
    background: (_currentPage, pageSize) => ({
      canvas: [{ type: 'rect', x: 0, y: 0, w: pageSize.width, h: pageSize.height, color: PDF_COLORS.paper }],
    }),
    content,
  };
}

/* ══════════════════════════════════════════════
   VISUALIZADOR — página de preview aberta numa aba
   própria, com uma barra de controle fora da área do
   PDF e um botão "Baixar PDF". O PDF em si (conteúdo,
   paginação, formatação) não é tocado aqui — só é
   exibido via <iframe> a partir do blob já gerado.
══════════════════════════════════════════════ */
function _buildLoadingHTML() {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>Gerando PDF…</title>
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%;background:#0c0f22;color:#ada698;font-family:system-ui,sans-serif;
    display:flex;align-items:center;justify-content:center}
  p{font-size:.9rem;letter-spacing:.02em}
</style></head>
<body><p>Gerando PDF…</p></body>
</html>`;
}

function _buildVisualizadorHTML(nomeArquivo, blobUrl) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>${esc(nomeArquivo)}</title>
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%;background:#525659;font-family:system-ui,sans-serif}
  .pdfview-bar{
    position:fixed;top:0;left:0;right:0;height:52px;
    display:flex;align-items:center;gap:.75rem;padding:0 1.25rem;
    background:#1c1c1c;color:#f0ead8;
    box-shadow:0 2px 10px rgba(0,0,0,.35);
    z-index:10;
  }
  .pdfview-bar__nome{margin-right:auto;font-size:.85rem;color:#ada698;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .pdfview-bar__btn{
    display:inline-flex;align-items:center;gap:.5rem;
    padding:.5rem 1.1rem;border-radius:8px;border:none;
    background:#7fcba0;color:#0c0f22;font-weight:700;font-size:.85rem;
    text-decoration:none;cursor:pointer;
  }
  .pdfview-bar__btn:hover{opacity:.9}
  .pdfview-frame{
    position:fixed;top:52px;left:0;right:0;bottom:0;
    width:100%;height:calc(100% - 52px);border:none;background:#525659;
  }
</style>
</head>
<body>
  <div class="pdfview-bar">
    <span class="pdfview-bar__nome">${esc(nomeArquivo)}</span>
    <a class="pdfview-bar__btn" href="${blobUrl}" download="${esc(nomeArquivo)}">⬇ Baixar PDF</a>
  </div>
  <iframe class="pdfview-frame" src="${blobUrl}"></iframe>
  <script>
    // libera a memória do blob quando essa aba for fechada
    window.addEventListener('pagehide', () => {
      try { URL.revokeObjectURL(${JSON.stringify(blobUrl)}); } catch (_) {}
    });
  </script>
</body>
</html>`;
}

/* ══════════════════════════════════════════════
   GERAR PDF — gera o mesmo PDF de sempre, mas em vez
   de baixar direto, abre uma aba de visualização com
   um botão "Baixar PDF" fora da área do documento.
══════════════════════════════════════════════ */
async function _onGenerate() {
  const grupos = _disciplinasSelecionadasOrdenadas();
  if (!grupos.length) return;

  playSound('click', 'resumos');

  // Abre a aba já no clique (síncrono), antes de qualquer await, para
  // não ser bloqueada como pop-up pelo navegador. O conteúdo final é
  // escrito nela assim que o PDF terminar de ser montado.
  const win = window.open('', '_blank');
  if (win) {
    win.document.write(_buildLoadingHTML());
    win.document.close();
  }

  const btn   = document.getElementById('pdf-generate-btn');
  const label = document.getElementById('pdf-generate-btn-label');
  if (btn) btn.disabled = true;
  if (label) label.textContent = 'Gerando…';

  try {
    await _carregarPdfMake();

    const tipoLabel = TIPO_LABEL[PdfState.tipo];
    const docDefinition = await _buildDocDefinition(grupos, tipoLabel);

    const semSlug = String(State.semestre ?? '').replace(/[^\w.-]+/g, '').replace(/\./g, '-');
    const nomeArquivo = `nexus-study-${PdfState.tipo}${semSlug ? `-${semSlug}` : ''}.pdf`;

    const blob = await new Promise(resolve => window.pdfMake.createPdf(docDefinition).getBlob(resolve));
    const blobUrl = URL.createObjectURL(blob);

    if (!win || win.closed) {
      alert('Seu navegador bloqueou a janela do PDF. Permita pop-ups para este site e tente novamente.');
      URL.revokeObjectURL(blobUrl);
      return;
    }

    win.document.open();
    win.document.write(_buildVisualizadorHTML(nomeArquivo, blobUrl));
    win.document.close();

    _fecharModalPdf();
  } catch (err) {
    console.error('[Resumo PDF] Falha ao gerar PDF:', err);
    if (win && !win.closed) win.close();
    alert('Não foi possível gerar o PDF. Tente novamente.');
  } finally {
    if (btn) btn.disabled = _contarSelecionadas() === 0;
    if (label) label.textContent = 'Gerar PDF';
  }
}

/* ══════════════════════════════════════════════
   ABRIR / FECHAR MODAL
══════════════════════════════════════════════ */
function _abrirModalPdf() {
  playSound('click', 'resumos');
  playSound('openModal', 'resumos');

  if (State.disciplina && PdfState.discIds.size === 0) {
    PdfState.discIds.add(State.disciplina.id);
  }

  if (!PdfState.tipoInicializado) {
    const map = { completo: 'resumo', sintese: 'sintese', resumao: 'resumao', professor: 'professor' };
    PdfState.tipo = map[State.modo] ?? 'resumo';
    PdfState.tipoInicializado = true;
    document.querySelectorAll('#pdf-tipo-list [data-tipo]').forEach(b => {
      b.classList.toggle('pdf-tipo-btn--active', b.dataset.tipo === PdfState.tipo);
    });
  }

  _renderDisciplinas();
  _refreshAulas();

  document.getElementById('pdf-modal')?.classList.add('pdf-modal--open');
  document.body.style.overflow = 'hidden';
}

function _fecharModalPdf() {
  playSound('closeModal', 'resumos');
  document.getElementById('pdf-modal')?.classList.remove('pdf-modal--open');
  document.body.style.overflow = '';
}

export function initPdfModal() {
  document.getElementById('btn-open-pdf')?.addEventListener('click', _abrirModalPdf);
  document.getElementById('pdf-modal-close')?.addEventListener('click', _fecharModalPdf);
  document.getElementById('pdf-modal-backdrop')?.addEventListener('click', _fecharModalPdf);

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (document.getElementById('pdf-modal')?.classList.contains('pdf-modal--open')) {
      _fecharModalPdf();
    }
  });

  document.getElementById('pdf-disc-all')?.addEventListener('click', _onDiscAllClick);
  document.getElementById('pdf-aulas-all')?.addEventListener('click', _onAulasAllClick);

  document.querySelectorAll('#pdf-tipo-list [data-tipo]').forEach(btn => {
    btn.addEventListener('click', () => _setTipo(btn.dataset.tipo));
  });

  document.getElementById('pdf-generate-btn')?.addEventListener('click', _onGenerate);
}