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
import { imgBase, imgBasePasta, encodePath } from './media-config.js';

/* ══════════════════════════════════════════════
   ESTADO DO MODAL DE PDF (local a este módulo)
══════════════════════════════════════════════ */
const PdfState = {
  discIds:          new Set(),  // disciplinas selecionadas (por id)
  tipos:            new Set(),  // tipos de conteúdo selecionados — agora múltiplos: subconjunto de 'resumo' | 'resumao' | 'sintese' | 'professor'
  tiposInicializados: false,
  aulaSel:          new Set(),  // chaves `${discId}::${tipo}::${idx}` selecionadas
  knownKeys:        new Set(),  // chaves já vistas (para aplicar default = selecionado só 1x)
  cache:            new Map(),  // discId -> { aulas, simplificado, resumao, professor }
  pending:          new Map(),  // discId -> Promise (carregamento em curso)
  loading:          new Set(),  // discIds carregando agora (para UI)
  gerando:          false,      // true durante _onGenerate — trava a seleção (ver _setGerando)
};

// A chave agora inclui o tipo: com seleção múltipla, a MESMA aula (mesmo
// idx) pode estar incluída simultaneamente em mais de um tipo (ex.: Resumo
// + Síntese da Aula 02) — sem o tipo na chave, marcar/desmarcar uma delas
// afetaria a outra por engano.
function _key(discId, tipo, idx) { return `${discId}::${tipo}::${idx}`; }

const TIPO_LABEL = { resumo: 'Resumo', resumao: 'Resumão', sintese: 'Síntese', professor: 'Nota do Professor' };
const TIPO_DESC = {
  resumo:    'Conteúdo completo e detalhado da aula.',
  resumao:   'Várias aulas em uma revisão geral.',
  sintese:   'Uma aula em tópicos rápidos.',
  professor: 'Resumo escrito pelo professor da disciplina.',
};
// Fonte única de verdade para a ORDEM dos tipos (usada na lista de
// seleção, no sumário do PDF e no corpo do PDF) — deriva das chaves de
// TIPO_LABEL em vez de duplicar a lista em outra constante.
const ALL_TIPOS = Object.keys(TIPO_LABEL);

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
function _getItens(discId, dados, tipo) {
  if (!dados) return [];

  if (tipo === 'sintese') {
    return dados.aulas
      .map((aula, idx) => {
        const s = dados.simplificado[idx] ?? null;
        const tem = !!(s && (s.ideia_central || (s.secoes ?? []).length > 0));
        return tem ? { idx, item: { aula: aula.aula, ideia_central: s.ideia_central, secoes: s.secoes } } : null;
      })
      .filter(Boolean);
  }

  if (tipo === 'resumao') {
    return dados.resumao
      .map((r, idx) => {
        const tem = !!(r && (r.ideia_central || (r.secoes ?? []).length > 0));
        return tem ? { idx, item: r } : null;
      })
      .filter(Boolean);
  }

  if (tipo === 'professor') {
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

/* ══════════════════════════════════════════════
   TIPOS DE CONTEÚDO DISPONÍVEIS — dinâmico
   Calculado a partir dos dados REAIS já carregados das
   disciplinas marcadas em "1 · Disciplinas" (mesma fonte
   que _getItens usa para montar a lista de aulas) — nunca
   uma segunda lista fixa/manual. Um tipo só aparece se
   pelo menos uma disciplina selecionada tiver conteúdo
   real desse tipo.
══════════════════════════════════════════════ */
function _tiposDisponiveis() {
  const discs = State.disciplinas.filter(d => PdfState.discIds.has(d.id));
  const disponiveis = new Set();
  discs.forEach(d => {
    const dados = PdfState.cache.get(d.id);
    if (!dados) return; // ainda carregando — não conta nem contra nem a favor
    ALL_TIPOS.forEach(tipo => {
      if (disponiveis.has(tipo)) return;
      if (_getItens(d.id, dados, tipo).length > 0) disponiveis.add(tipo);
    });
  });
  return ALL_TIPOS.filter(t => disponiveis.has(t));
}

function _tiposCarregando() {
  return [...PdfState.discIds].some(id => PdfState.loading.has(id));
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
   RENDER — TIPO DE CONTEÚDO (dinâmico + seleção múltipla)
   A lista de botões é reconstruída a cada mudança de
   disciplina(s) selecionada(s) ou de carregamento, sempre
   a partir de _tiposDisponiveis() — nunca um HTML fixo.
   Clique simplesmente alterna (toggle) o tipo no Set
   PdfState.tipos; vários podem ficar marcados ao mesmo
   tempo, sem checkbox nem botão "todos/nenhum" (o próprio
   botão do tipo já é o controle).
══════════════════════════════════════════════ */
function _limparSelecaoDoTipo(tipo) {
  // Remove só as entradas daquele tipo (chave `${discId}::${tipo}::${idx}`)
  // — ao reaparecer, o tipo volta a nascer com o default "selecionado".
  [...PdfState.aulaSel].forEach(k => { if (k.split('::')[1] === tipo) PdfState.aulaSel.delete(k); });
  [...PdfState.knownKeys].forEach(k => { if (k.split('::')[1] === tipo) PdfState.knownKeys.delete(k); });
}

function _toggleTipo(tipo) {
  playSound('select', 'resumos');
  if (PdfState.tipos.has(tipo)) {
    PdfState.tipos.delete(tipo);
    _limparSelecaoDoTipo(tipo);
  } else {
    PdfState.tipos.add(tipo);
  }
  document.querySelectorAll('#pdf-tipo-list [data-tipo]').forEach(b => {
    b.classList.toggle('pdf-tipo-btn--active', PdfState.tipos.has(b.dataset.tipo));
  });
  _renderAulas();
}

function _renderTipos() {
  const wrap = document.getElementById('pdf-tipo-list');
  if (!wrap) return;

  if (!PdfState.discIds.size) {
    wrap.innerHTML = `<div class="pdf-aulas-empty">Selecione ao menos uma disciplina.</div>`;
    return;
  }

  const disponiveis = _tiposDisponiveis();
  const carregando  = _tiposCarregando();

  if (!disponiveis.length) {
    wrap.innerHTML = carregando
      ? `<div class="pdf-aulas-empty">Carregando tipos de conteúdo…</div>`
      : `<div class="pdf-aulas-empty">Nenhum conteúdo disponível para a(s) disciplina(s) selecionada(s).</div>`;
    return;
  }

  // Poda tipos que deixaram de existir para a seleção atual de
  // disciplinas — só quando já temos certeza (nada pendente de
  // carregar), para não desmarcar um tipo válido só porque seus
  // dados ainda não chegaram.
  if (!carregando) {
    [...PdfState.tipos].forEach(t => {
      if (!disponiveis.includes(t)) {
        PdfState.tipos.delete(t);
        _limparSelecaoDoTipo(t);
      }
    });
  }

  wrap.innerHTML = disponiveis.map(tipo => `
    <button class="pdf-tipo-btn${PdfState.tipos.has(tipo) ? ' pdf-tipo-btn--active' : ''}" data-tipo="${esc(tipo)}" type="button">
      <span class="pdf-tipo-btn__nome">${esc(TIPO_LABEL[tipo])}</span>
      <span class="pdf-tipo-btn__desc">${esc(TIPO_DESC[tipo])}</span>
    </button>`).join('');

  wrap.querySelectorAll('[data-tipo]').forEach(btn => {
    btn.addEventListener('click', () => _toggleTipo(btn.dataset.tipo));
  });
}

/* ══════════════════════════════════════════════
   RENDER — AULAS (dependente de disciplinas + tipo)
══════════════════════════════════════════════ */
function _visiveisAulaKeys() {
  const keys = [];
  State.disciplinas.filter(d => PdfState.discIds.has(d.id)).forEach(disc => {
    const dados = PdfState.cache.get(disc.id);
    if (!dados) return;
    PdfState.tipos.forEach(tipo => {
      _getItens(disc.id, dados, tipo).forEach(it => keys.push(_key(disc.id, tipo, it.idx)));
    });
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

  if (!PdfState.tipos.size) {
    wrap.innerHTML = `<div class="pdf-aulas-empty">Selecione ao menos um tipo de conteúdo.</div>`;
    _updateFooter();
    _updateAulasAllLabel();
    return;
  }

  // Ordem estável (mesma de ALL_TIPOS), independente da ordem de clique.
  const tiposAtivos = ALL_TIPOS.filter(t => PdfState.tipos.has(t));
  // Com só 1 tipo ativo, mantém o visual exato de antes (sem
  // subcabeçalho de tipo) — o subcabeçalho só aparece quando é
  // realmente preciso diferenciar mais de um tipo na mesma disciplina.
  const multiTipo = tiposAtivos.length > 1;

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

    const blocosTipo = tiposAtivos.map(tipo => {
      const itens = _getItens(disc.id, dados, tipo);
      // Default: item novo nasce selecionado (por disciplina + tipo).
      itens.forEach(it => {
        const key = _key(disc.id, tipo, it.idx);
        if (!PdfState.knownKeys.has(key)) {
          PdfState.knownKeys.add(key);
          PdfState.aulaSel.add(key);
        }
      });
      return { tipo, itens };
    });

    const temAlgumItem = blocosTipo.some(b => b.itens.length > 0);
    if (!temAlgumItem) {
      html += `
        <div class="pdf-aula-grupo">
          <div class="pdf-aula-grupo__titulo">${esc(disc.apelido ?? disc.nome)}</div>
          <div class="pdf-aula-grupo__vazio">Nenhum conteúdo do${tiposAtivos.length !== 1 ? 's tipos selecionados' : ` tipo "${esc(TIPO_LABEL[tiposAtivos[0]])}"`} disponível.</div>
        </div>`;
      return;
    }

    html += `<div class="pdf-aula-grupo"><div class="pdf-aula-grupo__titulo">${esc(disc.apelido ?? disc.nome)}</div>`;

    blocosTipo.forEach(({ tipo, itens }) => {
      if (multiTipo) html += `<div class="pdf-aula-subgrupo__titulo">${esc(TIPO_LABEL[tipo])}</div>`;

      if (!itens.length) {
        html += `<div class="pdf-aula-grupo__vazio">Nenhum conteúdo de "${esc(TIPO_LABEL[tipo])}" disponível.</div>`;
        return;
      }

      html += itens.map((it, i) => {
        const key = _key(disc.id, tipo, it.idx);
        const checked = PdfState.aulaSel.has(key);
        const { titulo } = _splitTitulo(it.item.aula);
        const label = `Aula ${i + 1} - ${titulo || it.item.aula || ''}`;
        return `
          <label class="pdf-aula-item">
            <input type="checkbox" data-key="${esc(key)}" ${checked ? 'checked' : ''}>
            <span>${esc(label)}</span>
          </label>`;
      }).join('');
    });

    html += `</div>`;
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
  _renderTipos();
  _renderAulas();

  for (const disc of pendentes) {
    await _carregarConteudoDisciplina(disc);
    PdfState.loading.delete(disc.id);
    _renderTipos();
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
    PdfState.tipos.forEach(tipo => {
      _getItens(disc.id, dados, tipo).forEach(it => {
        if (PdfState.aulaSel.has(_key(disc.id, tipo, it.idx))) total++;
      });
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

/* Agrupa por AULA (idx) apenas os tipos que realmente DESCREVEM a
   mesma aula em formatos diferentes: resumo completo e síntese — os
   dois são indexados em cima de `dados.aulas` (mesmo idx = mesma
   aula). "Nota do professor" (tipo 'professor') NÃO é indexada por
   aula: `dados.professor` é uma lista própria e independente, então
   seu `idx` é só a posição dentro DESSA lista — nunca deve ser
   confundido com o idx de uma aula, mesmo quando os números
   coincidem por acaso. Por isso 'professor' fica de fora deste
   agrupamento.

   Resumão é conceitualmente a mesma coisa: é a JUNÇÃO de várias aulas
   num documento só, não "a aula X". Resumão e Revisão do professor
   são portanto os "OUTROS CONTEÚDOS" da disciplina — conteúdo
   independente, sem número de aula — e cada entrada vira seu próprio
   item em `outros`, nunca agrupada dentro dos marcadores de uma aula
   específica. É essa mesma separação (itensPorAula / outros) que
   alimenta tanto o corpo do PDF quanto o sumário da capa, então os
   dois nunca podem divergir sobre o que foi realmente incluído. */
function _disciplinasSelecionadasOrdenadas() {
  return State.disciplinas
    .filter(d => PdfState.discIds.has(d.id))
    .map(disc => {
      const dados = PdfState.cache.get(disc.id);

      const porIdx = new Map();
      ['resumo', 'sintese'].forEach(tipo => {
        if (!PdfState.tipos.has(tipo)) return;
        _getItens(disc.id, dados, tipo).forEach(it => {
          if (!PdfState.aulaSel.has(_key(disc.id, tipo, it.idx))) return;
          if (!porIdx.has(it.idx)) porIdx.set(it.idx, { idx: it.idx, tipos: [] });
          porIdx.get(it.idx).tipos.push({ tipo, item: it.item });
        });
      });
      const itensPorAula = [...porIdx.values()].sort((a, b) => a.idx - b.idx);

      // "Outros conteúdos" da disciplina: Resumão e Revisão do
      // professor, nesta ordem (mesma ordem de ALL_TIPOS). Cada item
      // guarda seu próprio `tipo`, já que a seção mistura os dois.
      const outros = ALL_TIPOS
        .filter(tipo => (tipo === 'resumao' || tipo === 'professor') && PdfState.tipos.has(tipo))
        .flatMap(tipo =>
          _getItens(disc.id, dados, tipo)
            .filter(it => PdfState.aulaSel.has(_key(disc.id, tipo, it.idx)))
            .map(it => ({ tipo, idx: it.idx, item: it.item }))
        );

      return { disc, itensPorAula, outros };
    })
    .filter(g => g.itensPorAula.length > 0 || g.outros.length > 0);
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

   Hierarquia (ver State/disciplinas → itensPorAula/outros
   em _disciplinasSelecionadasOrdenadas):
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
  // _disciplinasSelecionadasOrdenadas), então nunca são intercalados
  // dentro do loop de aulas acima.
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

async function _buildDocDefinition(grupos) {
  const { ano, periodo, ap } = parseSemestre(State.semestre ?? '2026.1');
  const sem = { ano, periodo, apPath: ap ? `/${ap}` : '' };

  // Com 1 tipo só ativo, título = exatamente o rótulo daquele tipo
  // (comportamento idêntico ao anterior). Com mais de um tipo
  // selecionado, "Resumo"/"Síntese"/etc. sozinho não descreveria o
  // conteúdo misto — usa um título genérico; o sumário logo abaixo
  // já mostra exatamente quais tipos entraram em cada aula.
  const tiposAtivos = ALL_TIPOS.filter(t => PdfState.tipos.has(t));
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
<head>
<meta charset="UTF-8">
<title>Gerando PDF…</title>
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%}
  body{
    background:
      radial-gradient(circle at 50% 32%, rgba(127,203,160,0.16), transparent 60%),
      #0c0f22;
    color:#ada698;
    font-family:system-ui,-apple-system,"Segoe UI",sans-serif;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    gap:1.4rem; text-align:center; padding:1.5rem;
  }
  .pdf-loader{ width:60px; height:60px; position:relative; display:flex; align-items:center; justify-content:center; }
  .pdf-loader svg{ width:30px; height:30px; color:#7fcba0; }
  .pdf-loader__ring{
    position:absolute; inset:0; border-radius:50%;
    border:3px solid rgba(127,203,160,0.15);
    border-top-color:#7fcba0;
    animation:pdf-spin .9s linear infinite;
  }
  @keyframes pdf-spin{ to{ transform:rotate(360deg); } }
  h1{ font-size:1.05rem; font-weight:700; color:#f0ead8; letter-spacing:.02em; }
  h1 #pdf-dots{ display:inline-block; width:1.4ch; text-align:left; }
  p{ font-size:.8rem; color:#8a8478; max-width:280px; line-height:1.5; }
</style>
</head>
<body>
  <div class="pdf-loader">
    <div class="pdf-loader__ring"></div>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <path d="M14 2v6h6"/>
    </svg>
  </div>
  <h1>Gerando PDF<span id="pdf-dots"></span></h1>
  <p>Isso pode levar alguns segundos — não feche esta aba.</p>
  <script>
    (function () {
      var el = document.getElementById('pdf-dots');
      var i = 0;
      setInterval(function () {
        i = (i + 1) % 4;
        el.textContent = '.'.repeat(i);
      }, 400);
    })();
  </script>
</body>
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
  .pdfview-frame{
    position:fixed;inset:0;
    width:100%;height:100%;border:none;background:#525659;
  }
</style>
</head>
<body>
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
   MOBILE — detecção + download direto
   O fluxo de "abrir aba nova com o PDF num <iframe>"
   (ver _buildVisualizadorHTML) depende do navegador ter
   um visualizador de PDF nativo capaz de renderizar
   dentro de IFRAME (não só em navegação de página
   inteira). Isso é comum em navegador de DESKTOP
   (Chrome/Edge/Firefox), mas não é garantido em
   navegadores MOBILE (Android e iOS) — lá, esse mesmo
   fluxo falha (aba em branco/erro do navegador) mesmo
   com o PDF já gerado com sucesso em memória.

   Em vez de tentar "consertar" o iframe no mobile (o que
   dependeria de comportamento de navegador fora do nosso
   controle), o mobile pula a etapa de visualização e vai
   direto para o download do mesmo Blob, na mesma aba —
   o único caminho que funciona de forma consistente em
   qualquer navegador mobile. O desktop continua exatamente
   como antes (nenhuma linha do fluxo de visualização foi
   alterada).
══════════════════════════════════════════════ */
function _isMobileDevice() {
  if (typeof navigator === 'undefined') return false;

  // API moderna (Chromium): quando existe, é a fonte mais confiável.
  if (navigator.userAgentData && typeof navigator.userAgentData.mobile === 'boolean') {
    return navigator.userAgentData.mobile;
  }

  const ua = navigator.userAgent || '';
  if (/Android|iPhone|iPod|Mobile|Windows Phone|BlackBerry|IEMobile|Opera Mini/i.test(ua)) return true;

  // iPadOS moderno se identifica como "Macintosh" no userAgent — o que
  // diferencia de um Mac de verdade é ter tela sensível ao toque.
  if (/iPad/i.test(ua)) return true;
  if (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) return true;

  return false;
}

function _baixarBlobDireto(blob, nomeArquivo) {
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = nomeArquivo;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoga depois de um tempo, não na hora — alguns navegadores mobile
  // iniciam o download de forma assíncrona; revogar cedo demais
  // derrubaria o download antes dele realmente começar.
  setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
}

/* ══════════════════════════════════════════════
   NOME DO ARQUIVO — curto, legível e baseado nos
   apelidos das disciplinas (mesmo campo `apelido` que o
   resto deste arquivo já usa, ex.: `disc.apelido ?? disc.nome`
   em _renderDisciplinas/_renderAulas/_buildCapaPdfMake — sem
   inventar outra fonte de apelido).

   Deriva disciplinas e tipos DIRETO de `grupos` — o
   resultado real de _disciplinasSelecionadasOrdenadas(),
   já filtrado para só o que tem conteúdo marcado — nunca da
   seleção bruta da UI. Assim o nome nunca promete um tipo ou
   disciplina que na verdade não entrou no PDF (ex.: um tipo
   marcado em "2 · Tipo de conteúdo" mas sem nenhuma aula
   marcada em "3 · Aulas" não aparece no PDF, e por isso
   também não aparece no nome do arquivo).
══════════════════════════════════════════════ */
const TIPO_SLUG = { resumo: 'RESUMO', resumao: 'RESUMAO', sintese: 'SINTESE', professor: 'PROFESSOR' };

const NOME_DISC_LIMITE = 3;  // acima disso, vira "MULTIDISC"
const NOME_DISC_MAXLEN = 30; // mesmo com poucas disciplinas, apelidos grandes demais também viram "MULTIDISC"

function _sanitizarNomeArquivo(str) {
  const limpo = String(str ?? '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos (ex.: "Síntese" -> "Sintese")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')                        // espaço/pontuação/qualquer coisa não-alfanumérica -> "_"
    .replace(/^_+|_+$/g, '');                            // sem "_" sobrando nas pontas
  return limpo || 'DISC';
}

function _buildNomeArquivo(grupos) {
  // Disciplinas — poucas o bastante (e curtas o bastante) para
  // aparecerem por extenso; senão, identificação curta ("MULTIDISC").
  const discSlugs = grupos.map(g => _sanitizarNomeArquivo(g.disc.apelido ?? g.disc.nome));
  const discJunto = discSlugs.join('_');
  const discPart = (grupos.length <= NOME_DISC_LIMITE && discJunto.length <= NOME_DISC_MAXLEN)
    ? discJunto
    : 'MULTIDISC';

  // Tipos realmente incluídos no PDF (ver comentário acima do bloco).
  const tiposIncluidos = new Set();
  grupos.forEach(g => {
    g.itensPorAula.forEach(a => a.tipos.forEach(t => tiposIncluidos.add(t.tipo)));
    g.outros.forEach(o => tiposIncluidos.add(o.tipo));
  });
  const tiposOrdenados = ALL_TIPOS.filter(t => tiposIncluidos.has(t));
  const modoPart = (tiposOrdenados.length > 0 && tiposOrdenados.length <= 2)
    ? tiposOrdenados.map(t => TIPO_SLUG[t]).join('_')
    : 'MULTIMODO';

  return `${discPart}_${modoPart}.pdf`;
}

/* ══════════════════════════════════════════════
   ORIGEM INSEGURA (HTTP fora de localhost) — o aviso do
   Chrome "Não é possível salvar o arquivo com segurança"
   (visto no Android acessando por IP de rede local, ex.:
   192.168.1.29:5500) é um comportamento do PRÓPRIO Chrome:
   ele passou a exigir HTTPS para confirmar a segurança de
   um download, e só abre exceção para `localhost`/`127.0.0.1`
   — nunca para outro IP, mesmo dentro da rede local. Não há
   nenhuma chamada de API (Blob, download, iframe, window.open)
   que evite essa checagem a partir do lado do site; ela
   acontece no navegador, depois que o download já foi
   entregue a ele. Por isso o mesmo fluxo funciona sem aviso
   no Windows quando acessado por `http://localhost:5500`
   (contexto que o Chrome trata como seguro) e mostra o aviso
   no Android quando acessado pelo IP da rede (que não tem
   essa exceção) — e não aconteceria em produção, servido via
   HTTPS.
   Em vez de tentar escondê-lo ou simular que não existe,
   avisamos o usuário UMA VEZ por carregamento de página,
   antes de gerar, explicando o que é e o que fazer (tocar em
   "Manter"). O download em si continua sendo disparado
   normalmente — o aviso é só informativo.
══════════════════════════════════════════════ */
function _origemInsegura() {
  if (typeof location === 'undefined') return false;
  if (location.protocol === 'https:') return false;
  const host = (location.hostname || '').toLowerCase();
  if (host === 'localhost' || host === '127.0.0.1' || host === '::1' || host === '[::1]') return false;
  return true;
}

let _avisoOrigemInseguraMostrado = false;
function _avisarSeOrigemInsegura() {
  if (_avisoOrigemInseguraMostrado || !_origemInsegura()) return;
  _avisoOrigemInseguraMostrado = true;
  alert(
    'Este site está sendo acessado por um endereço local sem HTTPS ' +
    `(${location.hostname}).\n\n` +
    'Por isso, o Chrome pode mostrar o aviso dele próprio "Não é possível ' +
    'salvar o arquivo com segurança" ao salvar o PDF — é uma proteção do ' +
    'navegador para conexões sem HTTPS, não um erro do Nexus Study.\n\n' +
    'Para salvar o arquivo, toque em "Manter" nesse aviso. Em produção ' +
    '(servido via HTTPS), esse aviso não aparece.'
  );
}

/* ══════════════════════════════════════════════
   ESTADO "GERANDO" — trava toda a seleção do modal
   (disciplinas, tipo, aulas, "selecionar/remover todas",
   fechar/backdrop) enquanto o PDF está sendo montado, para
   impedir que o usuário mude a seleção no meio da geração
   ou clique "Gerar PDF" de novo (2º clique não inicia uma
   2ª geração — ver guarda em _onGenerate). Chamada com
   true no início e com false tanto no sucesso quanto no
   catch/finally de _onGenerate, então o modal nunca fica
   travado permanentemente.
══════════════════════════════════════════════ */
function _setGerando(ativo) {
  PdfState.gerando = ativo;

  document.querySelectorAll('#pdf-disc-list input[type="checkbox"], #pdf-aulas-list input[type="checkbox"]')
    .forEach(cb => { cb.disabled = ativo; });
  document.querySelectorAll('#pdf-tipo-list [data-tipo]').forEach(b => { b.disabled = ativo; });

  if (ativo) {
    document.getElementById('pdf-disc-all')?.setAttribute('disabled', '');
    document.getElementById('pdf-aulas-all')?.setAttribute('disabled', '');
    document.getElementById('pdf-modal-close')?.setAttribute('disabled', '');
  } else {
    document.getElementById('pdf-modal-close')?.removeAttribute('disabled');
    // O disabled de "Selecionar/Remover todas" depende do conteúdo
    // disponível, não é um simples liga/desliga — por isso, ao
    // destravar, cada botão recalcula o próprio estado pelas mesmas
    // funções que já fazem isso em qualquer outra atualização da UI,
    // em vez de forçar `disabled = false` cegamente.
    _updateDiscAllLabel();
    _updateAulasAllLabel();
  }

  const backdrop = document.getElementById('pdf-modal-backdrop');
  if (backdrop) backdrop.style.pointerEvents = ativo ? 'none' : '';

  const body = document.querySelector('#pdf-modal .pdf-modal__body');
  if (body) {
    body.style.pointerEvents = ativo ? 'none' : '';
    body.style.opacity = ativo ? '0.45' : '';
    body.setAttribute('aria-busy', ativo ? 'true' : 'false');
  }

  const btn   = document.getElementById('pdf-generate-btn');
  const label = document.getElementById('pdf-generate-btn-label');
  if (label) label.textContent = ativo ? 'Gerando PDF…' : 'Gerar PDF';
  if (btn) {
    btn.classList.toggle('pdf-generate-btn--loading', ativo);
    // Fora da geração, o botão continua seguindo a mesma regra de
    // sempre (só habilitado com pelo menos 1 item selecionado).
    btn.disabled = ativo || _contarSelecionadas() === 0;
  }
}

// Gira o ícone do botão "Gerar PDF" enquanto `.pdf-generate-btn--loading`
// estiver presente — único CSS que este módulo precisa injetar (o resto
// do estilo do modal já vem de resumo.html); injetado uma única vez.
function _injetarEstiloGerando() {
  if (document.getElementById('pdf-gerando-style')) return;
  const style = document.createElement('style');
  style.id = 'pdf-gerando-style';
  style.textContent = `
    .pdf-generate-btn--loading svg { animation: pdf-gerando-spin .8s linear infinite; }
    @keyframes pdf-gerando-spin { to { transform: rotate(360deg); } }
  `;
  document.head.appendChild(style);
}

/* ══════════════════════════════════════════════
   GERAR PDF — no desktop, gera o mesmo PDF de sempre e
   abre uma aba de visualização (ver comentário de
   _isMobileDevice acima). No mobile, gera o mesmo PDF e
   manda direto para download, sem aba nova.
══════════════════════════════════════════════ */
async function _onGenerate() {
  // 2º clique (ou clique duplo) enquanto já está gerando não inicia uma
  // 2ª geração em paralelo — o próprio botão já fica `disabled` durante
  // a geração (ver _setGerando), esta é só uma segunda trava, para o
  // caso de o clique chegar antes do disabled ser aplicado no DOM.
  if (PdfState.gerando) return;

  const grupos = _disciplinasSelecionadasOrdenadas();
  if (!grupos.length) return;

  playSound('click', 'resumos');
  _setGerando(true);

  const mobile = _isMobileDevice();
  _avisarSeOrigemInsegura();

  // Abre a aba já no clique (síncrono), antes de qualquer await, para
  // não ser bloqueada como pop-up pelo navegador. O conteúdo final é
  // escrito nela assim que o PDF terminar de ser montado. No mobile,
  // essa aba nem chega a ser aberta — ver comentário acima.
  const win = mobile ? null : window.open('', '_blank');
  if (win) {
    win.document.write(_buildLoadingHTML());
    win.document.close();
  }

  try {
    await _carregarPdfMake();

    const docDefinition = await _buildDocDefinition(grupos);
    const nomeArquivo = _buildNomeArquivo(grupos);

    const blob = await new Promise(resolve => window.pdfMake.createPdf(docDefinition).getBlob(resolve));

    if (mobile) {
      _baixarBlobDireto(blob, nomeArquivo);
      _fecharModalPdf();
      return;
    }

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
    // Sempre destrava — tanto no sucesso quanto no catch acima — para
    // a tela nunca ficar permanentemente bloqueada.
    _setGerando(false);
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

  if (!PdfState.tiposInicializados) {
    // Default = comportamento anterior: nasce com só o tipo
    // correspondente ao modo de leitura atual da página, já marcado.
    const map = { completo: 'resumo', sintese: 'sintese', resumao: 'resumao', professor: 'professor' };
    PdfState.tipos = new Set([map[State.modo] ?? 'resumo']);
    PdfState.tiposInicializados = true;
  }

  _renderDisciplinas();
  _refreshAulas(); // também chama _renderTipos() internamente, conforme os dados chegam

  document.getElementById('pdf-modal')?.classList.add('pdf-modal--open');
  document.body.style.overflow = 'hidden';
}

function _fecharModalPdf() {
  // Guarda única para close/backdrop/Escape (os 3 caminhos que chamam
  // esta função) — nunca fecha (nem interrompe) o modal enquanto o PDF
  // está sendo gerado.
  if (PdfState.gerando) return;
  playSound('closeModal', 'resumos');
  document.getElementById('pdf-modal')?.classList.remove('pdf-modal--open');
  document.body.style.overflow = '';
}

export function initPdfModal() {
  _injetarEstiloGerando();

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

  // Os botões de "2 · Tipo de conteúdo" são renderizados
  // dinamicamente por _renderTipos() (chamada por _refreshAulas()),
  // que já liga o listener de clique em cada botão que cria — não há
  // mais um conjunto fixo de botões para ligar aqui.

  document.getElementById('pdf-generate-btn')?.addEventListener('click', _onGenerate);
}