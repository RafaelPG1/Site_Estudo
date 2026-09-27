/* =============================================
   NEXUS STUDY — resumo/js/pdf/resumo-pdf.js
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

   Este arquivo cuida só da ORQUESTRAÇÃO: estado de
   seleção do modal (disciplinas/tipo/aulas), a UI desse
   modal, contar itens, montar o nome do arquivo e disparar
   a geração — sem saber COMO o PDF é montado por dentro nem
   COMO ele é exibido depois. Essas duas partes vivem em:

     resumo-pdf-document.js  → o que é o PDF (pdfmake)
     resumo-pdf-viewer.js    → como o PDF é mostrado/baixado

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
   controlados nativamente pelo pdfmake (ver
   resumo-pdf-document.js).

   O pdfmake é carregado sob demanda via CDN (cdnjs),
   do mesmo jeito que o resto do projeto já carrega
   scripts externos sob demanda (ver carregarIA() em
   resumo-utils.js) — não precisa de bundler nem de
   dependência nova no projeto.
   ============================================= */

import { resolveIcone, parseSemestre } from '../../../src/global.js';
import { playSound } from '../../../shared/js/audio/audio-api.js';
import { getZoomResumoPdf } from '../../../shared/js/utils/zoom.js';
import { State, esc } from '../resumo-utils.js';
import { _buildDocDefinition, _carregarPdfMake, _splitTitulo, TIPO_LABEL, ALL_TIPOS } from './resumo-pdf-document.js';
import { _buildLoadingHTML, _buildVisualizadorHTML, _abrirVisualizador, _isMobileDevice, _baixarBlobDireto } from './resumo-pdf-viewer.js';

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

// TIPO_LABEL e ALL_TIPOS vêm de resumo-pdf-document.js (fonte única de
// verdade, também usada dentro do PDF em si — capa/sumário/corpo).
const TIPO_DESC = {
  resumo:    'Conteúdo completo e detalhado da aula.',
  resumao:   'Várias aulas em uma revisão geral.',
  sintese:   'Uma aula em tópicos rápidos.',
  professor: 'Resumo escrito pelo professor da disciplina.',
};

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
   alimenta tanto o corpo do PDF (resumo-pdf-document.js) quanto o
   sumário da capa, então os dois nunca podem divergir sobre o que foi
   realmente incluído. */
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
   NOME DO ARQUIVO — curto, legível e baseado nos
   apelidos das disciplinas (mesmo campo `apelido` que o
   resto deste arquivo já usa, ex.: `disc.apelido ?? disc.nome`
   em _renderDisciplinas/_renderAulas — sem inventar outra
   fonte de apelido).

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

   O CSS do spin do ícone (".pdf-generate-btn--loading")
   vive em css/resumo-pdf.css — não precisa mais ser
   injetado por JS, já que é CSS do próprio resumo.html
   (diferente do CSS do visualizador, que pertence a um
   documento HTML totalmente separado — ver
   resumo-pdf-viewer.js).
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

/* ══════════════════════════════════════════════
   GERAR PDF — no desktop, gera o mesmo PDF de sempre e
   abre uma aba de visualização (ver comentário de
   _isMobileDevice em resumo-pdf-viewer.js). No mobile,
   gera o mesmo PDF e manda direto para download, sem aba
   nova.
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
  // essa aba nem chega a ser aberta — ver resumo-pdf-viewer.js.
  const win = mobile ? null : window.open('', '_blank');
  if (win) {
    _abrirVisualizador(win, _buildLoadingHTML());
  }

  try {
    await _carregarPdfMake();

    // Mesmo filtro/ordem de sempre (ALL_TIPOS na ordem estável),
    // calculado aqui (onde vive a seleção do modal) e passado pronto
    // para o construtor do documento, que não lê PdfState diretamente.
    const tiposAtivos = ALL_TIPOS.filter(t => PdfState.tipos.has(t));
    const docDefinition = await _buildDocDefinition(grupos, tiposAtivos);
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

    // Zoom inicial do visualizador = área PRÓPRIA 'resumo_pdf' (ver
    // zoom.js::getZoomResumoPdf) — nunca a área 'resumos' do Resumo
    // normal (getZoomAtual()). São dois estados de zoom independentes:
    // ajustar o zoom aqui no PDF nunca deve mexer no zoom do Resumo, e
    // vice-versa. Nenhum "ajustar à tela" calculado à parte (ver
    // comentário em resumo-pdf-viewer.js sobre essa integração).
    const zoomInicial = getZoomResumoPdf();

    _abrirVisualizador(win, _buildVisualizadorHTML(nomeArquivo, blobUrl, zoomInicial));

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