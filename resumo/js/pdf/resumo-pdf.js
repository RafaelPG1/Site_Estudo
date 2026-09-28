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

   EXTRAS NO MESMO MODAL
   Ao lado do PDF (área principal) há uma coluna secundária "Extras"
   (#pdf-extras, ver _ensureExtrasUI/_renderExtras) com os mapas
   mentais, vídeos e links da(s) disciplina(s) marcada(s). Os extras
   NÃO entram no PDF e têm botão próprio: baixam no formato original,
   arquivo por arquivo (mapa mental e vídeo local); links e vídeos
   externos só abrem/copiam. A lista e a resolução de caminho vêm de
   extrasDaDisciplina() em resumo-extra.js — a mesma fonte da Home.

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
import { extrasDaDisciplina } from '../resumo-extra.js';
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
  porDisciplina:    false,      // true = "Baixar separado por disciplina" (ver _onGenerate/_gerarPdfsSeparados)
  extraSel:         new Set(),  // chaves `${discId}::extra::${i}` de arquivos extras marcados para baixar
  extraKnown:       new Set(),  // chaves de extras já vistas (default = selecionado só 1x, igual a knownKeys)
  extrasAberto:     false,      // "Escolher itens" da coluna Extras está expandido?
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
        extra:        raw?.extra && typeof raw.extra === 'object' ? raw.extra : null,
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
   EXTRAS — coluna secundária do modal
   Usa o mesmo cache por disciplina (PdfState.cache) e a mesma
   extrasDaDisciplina() do modo Extra da Home — nada de lista
   paralela. `arquivos` = baixáveis (mapa mental, vídeo local);
   `links` = só acesso (link e vídeo externo).
══════════════════════════════════════════════ */
const _ORDEM_CATS = ['mapasMentais', 'videos', 'links'];

const _ICO_PATHS = {
  mapasMentais: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
  videos:       '<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  links:        '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  arquivo:      '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
  baixar:       '<path d="M12 3v12"/><path d="M7.5 10.5L12 15l4.5-4.5"/><path d="M4 19h16"/>',
  seta:         '<path d="m6 9 6 6 6-6"/>',
};
function _ico(nome, tam = 16) {
  const p = _ICO_PATHS[nome] ?? _ICO_PATHS.arquivo;
  return `<svg width="${tam}" height="${tam}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
}

function _keyExtra(discId, i) { return `${discId}::extra::${i}`; }

function _extrasDe(disc) {
  const dados = PdfState.cache.get(disc.id);
  if (!dados) return { arquivos: [], links: [] };
  return extrasDaDisciplina(dados.extra);
}

function _extExtra(url) {
  let path;
  try { path = new URL(url, location.href).pathname; } catch { path = String(url); }
  const m = path.split(/[?#]/)[0].match(/\.([a-z0-9]{2,5})$/i);
  return m ? `.${m[1].toLowerCase()}` : '';
}

/* Disciplinas (na ordem do modal) que têm ao menos 1 arquivo extra
   marcado, com os arquivos marcados de cada uma — mesmo papel que
   _disciplinasSelecionadasOrdenadas() tem para o PDF. */
function _extrasSelecionadosPorDisciplina() {
  return State.disciplinas
    .filter(d => PdfState.discIds.has(d.id))
    .map(disc => ({
      disc,
      arquivos: _extrasDe(disc).arquivos.filter((_, i) => PdfState.extraSel.has(_keyExtra(disc.id, i))),
    }))
    .filter(g => g.arquivos.length > 0);
}

function _contarExtrasSelecionados() {
  return _extrasSelecionadosPorDisciplina().reduce((n, g) => n + g.arquivos.length, 0);
}

/* Só o botão de baixar (rótulo + habilitado) — usado ao marcar/
   desmarcar itens, para não reconstruir a lista (perderia a rolagem). */
function _syncBotaoExtras() {
  const btn = document.getElementById('pdf-extras-baixar');
  if (!btn) return;
  const n = _contarExtrasSelecionados();
  const label = btn.querySelector('.pdf-extras__btn-label');
  if (label) label.textContent = n === 0 ? 'Nenhum arquivo marcado' : `Baixar ${n} arquivo${n !== 1 ? 's' : ''}`;
  btn.disabled = PdfState.gerando || n === 0;
}

function _renderExtras() {
  const aside = document.getElementById('pdf-extras');
  if (!aside) return;

  const selecionadas = State.disciplinas.filter(d => PdfState.discIds.has(d.id));
  const carregando = selecionadas.some(d => PdfState.loading.has(d.id) || !PdfState.cache.has(d.id));
  const porDisc = selecionadas
    .map(disc => ({ disc, ..._extrasDe(disc) }))
    .filter(g => g.arquivos.length || g.links.length);

  // Certeza de que nenhuma disciplina marcada tem extras: a coluna some
  // e o PDF ocupa o modal inteiro (ver .pdf-modal__body:has(> [hidden])).
  if (selecionadas.length && !carregando && !porDisc.length) {
    aside.hidden = true;
    aside.innerHTML = '';
    return;
  }
  aside.hidden = false;

  const cabecalho = `
    <div class="pdf-extras__head">
      <h3 class="pdf-extras__titulo">Extras</h3>
      <p class="pdf-extras__nota">Complementos das disciplinas. Não entram no PDF.</p>
    </div>`;

  if (!selecionadas.length || !porDisc.length) {
    aside.innerHTML = cabecalho + `<p class="pdf-extras__vazio">${
      selecionadas.length ? 'Carregando extras…' : 'Selecione uma disciplina para ver os extras.'
    }</p>`;
    return;
  }

  // Resumo por categoria (todos os itens: arquivos + links)
  const resumo = new Map();
  const somar = it => {
    const r = resumo.get(it.cat) ?? { categoria: it.categoria ?? it.singular, n: 0 };
    r.n++;
    resumo.set(it.cat, r);
  };
  porDisc.forEach(g => { g.arquivos.forEach(somar); g.links.forEach(somar); });
  const cats = [...resumo.keys()].sort((a, b) => {
    const ia = _ORDEM_CATS.indexOf(a), ib = _ORDEM_CATS.indexOf(b);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });

  const totalArquivos = porDisc.reduce((n, g) => n + g.arquivos.length, 0);
  const totalLinks    = porDisc.reduce((n, g) => n + g.links.length, 0);

  // Lista expansível ("Escolher itens")
  const multi = porDisc.length > 1;
  let lista = '';
  porDisc.forEach(g => {
    if (multi) lista += `<div class="pdf-extras__disc">${esc(g.disc.apelido ?? g.disc.nome)}</div>`;

    g.arquivos.forEach((a, i) => {
      const key = _keyExtra(g.disc.id, i);
      if (!PdfState.extraKnown.has(key)) {           // default: nasce marcado
        PdfState.extraKnown.add(key);
        PdfState.extraSel.add(key);
      }
      const ext = _extExtra(a.url);
      lista += `
        <label class="pdf-aula-item pdf-extras__item">
          <input type="checkbox" data-key-extra="${esc(key)}" ${PdfState.extraSel.has(key) ? 'checked' : ''}>
          <span class="pdf-extras__item-nome" title="${esc(a.titulo)}">${esc(a.titulo)}</span>
          ${ext ? `<span class="pdf-extras__ext">${esc(ext.slice(1).toUpperCase())}</span>` : ''}
        </label>`;
    });

    g.links.forEach(l => {
      lista += `
        <div class="pdf-aula-item pdf-extras__item pdf-extras__item--link">
          <span class="pdf-extras__item-nome" title="${esc(l.url)}">${esc(l.titulo)}</span>
          <a class="pdf-mini-btn" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">Abrir</a>
          <button type="button" class="pdf-mini-btn" data-copiar-link="${esc(l.url)}">Copiar</button>
        </div>`;
    });
  });

  const rotuloDetalhes = totalArquivos && totalLinks ? 'Escolher itens e links'
                       : totalArquivos              ? 'Escolher arquivos'
                       :                              'Ver links';

  aside.innerHTML = cabecalho + `
    <ul class="pdf-extras__resumo">
      ${cats.map(c => `
        <li>
          <span class="pdf-extras__ico">${_ico(c)}</span>
          <span class="pdf-extras__nome">${esc(resumo.get(c).categoria)}</span>
          <span class="pdf-extras__qtd">${resumo.get(c).n}</span>
        </li>`).join('')}
    </ul>
    ${totalArquivos ? `
    <button type="button" class="pdf-extras__btn" id="pdf-extras-baixar">
      ${_ico('baixar', 15)}<span class="pdf-extras__btn-label"></span>
    </button>` : ''}
    <details class="pdf-extras__itens"${PdfState.extrasAberto ? ' open' : ''}>
      <summary><span>${rotuloDetalhes}</span>${_ico('seta', 14)}</summary>
      <div class="pdf-extras__lista">${lista}</div>
    </details>`;

  aside.querySelector('details')?.addEventListener('toggle', e => { PdfState.extrasAberto = e.target.open; });
  aside.querySelectorAll('input[data-key-extra]').forEach(cb => {
    cb.addEventListener('change', () => {
      const key = cb.dataset.keyExtra;
      if (cb.checked) PdfState.extraSel.add(key); else PdfState.extraSel.delete(key);
      _syncBotaoExtras();
    });
  });
  aside.querySelectorAll('[data-copiar-link]').forEach(btn => {
    btn.addEventListener('click', () => _copiarLink(btn));
  });
  document.getElementById('pdf-extras-baixar')?.addEventListener('click', _onGenerateExtras);

  _syncBotaoExtras();
}

async function _copiarLink(btn) {
  const url = btn.dataset.copiarLink;
  playSound('click', 'resumos');
  try {
    await navigator.clipboard.writeText(url);
  } catch {
    // Fallback para contextos sem Clipboard API (ex.: HTTP fora de localhost).
    const ta = document.createElement('textarea');
    ta.value = url;
    ta.style.cssText = 'position:fixed;opacity:0;';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch { /* sem o que fazer */ }
    ta.remove();
  }
  const antes = btn.textContent;
  btn.textContent = 'Copiado!';
  setTimeout(() => { btn.textContent = antes; }, 1500);
}

/* Cria a coluna #pdf-extras (1x, idempotente) e garante as classes de
   colocação das seções no grid do corpo (.pdf-section--disc/--tipo/
   --aulas). Achamos cada seção pelo id da lista que ela contém e
   subimos até o filho direto do corpo — assim o layout não depende de
   como o HTML do modal nomeou as seções. */
function _ensureExtrasUI() {
  const body = document.querySelector('#pdf-modal .pdf-modal__body');
  if (!body) return;

  const secaoDe = id => {
    let el = document.getElementById(id);
    while (el && el.parentElement !== body) el = el.parentElement;
    return el;
  };
  [['pdf-disc-list', 'disc'], ['pdf-tipo-list', 'tipo'], ['pdf-aulas-list', 'aulas']].forEach(([id, nome]) => {
    secaoDe(id)?.classList.add('pdf-section', `pdf-section--${nome}`);
  });

  if (document.getElementById('pdf-extras')) return;
  const aside = document.createElement('aside');
  aside.className = 'pdf-extras';
  aside.id = 'pdf-extras';
  aside.setAttribute('aria-label', 'Extras');
  aside.hidden = true;
  body.appendChild(aside);
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
    // Mesma fonte de cor da sidebar (renderSidebar em resumo-ui.js):
    // State.DISC_CORES[disc.arquivo].corTema, aplicada como --cor-tema
    // local no span — o SVG de resolveIcone() já lê essa variável.
    const corIcone = State.DISC_CORES?.[disc.arquivo]?.corTema ?? null;
    return `
      <label class="pdf-disc-item">
        <input type="checkbox" data-disc-id="${esc(disc.id)}" ${checked ? 'checked' : ''}>
        <span class="pdf-disc-item__emoji"${corIcone ? ` style="--cor-tema:${esc(corIcone)}"` : ''}>${disc.icone ? resolveIcone(disc.icone) : ''}</span>
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
  document.querySelectorAll('#pdf-tipo-list input[data-tipo]').forEach(b => {
    b.checked = PdfState.tipos.has(b.dataset.tipo);
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
    <label class="pdf-disc-item pdf-tipo-item">
      <input type="checkbox" data-tipo="${esc(tipo)}" ${PdfState.tipos.has(tipo) ? 'checked' : ''}>
      <span class="pdf-tipo-item__txt">
        <span class="pdf-tipo-item__nome">${esc(TIPO_LABEL[tipo])}</span>
        <span class="pdf-tipo-item__desc">${esc(TIPO_DESC[tipo])}</span>
      </span>
    </label>`).join('');

  wrap.querySelectorAll('input[data-tipo]').forEach(cb => {
    cb.addEventListener('change', () => _toggleTipo(cb.dataset.tipo));
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
  _renderExtras();

  for (const disc of pendentes) {
    await _carregarConteudoDisciplina(disc);
    PdfState.loading.delete(disc.id);
    _renderTipos();
    _renderAulas();
    _renderExtras();
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
   TOGGLE — "BAIXAR SEPARADO POR DISCIPLINA"
   Novo controle do footer do modal: quando marcado, _onGenerate
   passa a gerar 1 PDF por disciplina selecionada (ver
   _gerarPdfsSeparados) em vez do PDF único de sempre. Criado 1 vez
   (idempotente — a guarda por id no início evita duplicar em
   reaberturas do modal) e inserido dentro do footer já existente,
   ao lado do texto de contagem, sem tocar no botão "Gerar PDF" nem
   no restante do template do modal.
══════════════════════════════════════════════ */
function _ensureSeparadoToggleUI() {
  if (document.getElementById('pdf-separado-toggle')) return;

  const footer = document.querySelector('#pdf-modal .pdf-modal__footer');
  const countEl = document.getElementById('pdf-modal-count');
  if (!footer || !countEl) return;

  // Agrupa "contagem + toggle" do lado esquerdo do footer, deixando o
  // botão "Gerar PDF" sozinho à direita — mesmo espaçamento visual de
  // sempre (space-between), só que agora entre 2 grupos em vez de 2
  // elementos soltos (ver .pdf-modal__footer-left em resumo-pdf.css).
  const leftGroup = document.createElement('div');
  leftGroup.className = 'pdf-modal__footer-left';
  footer.insertBefore(leftGroup, countEl);
  leftGroup.appendChild(countEl);

  const label = document.createElement('label');
  label.className = 'pdf-separado-toggle';
  label.innerHTML = `
    <input type="checkbox" id="pdf-separado-toggle">
    <span>Baixar separado por disciplina</span>`;
  leftGroup.insertBefore(label, countEl);

  document.getElementById('pdf-separado-toggle').addEventListener('change', e => {
    playSound('select', 'resumos');
    PdfState.porDisciplina = e.target.checked;
    _updateFooter();
  });
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

// Mesmo critério de "está incluído" de _contarSelecionadas, só que
// contando disciplinas (discId) em vez de itens — usada só para a
// mensagem do footer e para o rótulo do botão "Gerar PDF(s)" quando
// "Baixar separado por disciplina" está ativo (ver _updateFooter).
function _contarDiscsSelecionadas() {
  const discs = new Set();
  State.disciplinas.filter(d => PdfState.discIds.has(d.id)).forEach(disc => {
    const dados = PdfState.cache.get(disc.id);
    if (!dados) return;
    PdfState.tipos.forEach(tipo => {
      _getItens(disc.id, dados, tipo).forEach(it => {
        if (PdfState.aulaSel.has(_key(disc.id, tipo, it.idx))) discs.add(disc.id);
      });
    });
  });
  return discs.size;
}

function _updateFooter() {
  const total    = _contarSelecionadas();
  const nDiscs   = _contarDiscsSelecionadas();
  const countEl  = document.getElementById('pdf-modal-count');
  const genBtn   = document.getElementById('pdf-generate-btn');
  const genLabel = document.getElementById('pdf-generate-btn-label');

  // Só faz sentido falar em "N PDFs" quando o toggle está ligado E há
  // de fato mais de 1 disciplina com conteúdo selecionado — com 1 só,
  // separado e único dão o mesmo arquivo (ver _onGenerate).
  const vaiSeparar = PdfState.porDisciplina && nDiscs > 1;

  if (countEl) {
    if (total === 0) {
      countEl.textContent = 'Nenhuma aula selecionada';
    } else {
      const base = `${total} ite${total !== 1 ? 'ns' : 'm'} selecionado${total !== 1 ? 's' : ''}`;
      countEl.textContent = vaiSeparar ? `${base} · ${nDiscs} PDFs serão gerados` : base;
    }
  }
  if (genBtn) genBtn.disabled = total === 0;
  // Fora da geração, o rótulo do botão já reflete o modo escolhido;
  // durante a geração, _setGerando é quem controla esse texto
  // ("Gerando PDF…"), então não mexemos nele aqui.
  if (genLabel && !PdfState.gerando) genLabel.textContent = vaiSeparar ? 'Gerar PDFs' : 'Gerar PDF';
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
const TIPO_SLUG = { resumo: 'RESUMO', resumao: 'RESUMAO', sintese: 'SINTESE', professor: 'REVISAO' };

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
   "baixar separado por disciplina", fechar/backdrop) enquanto
   o PDF está sendo montado, para
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
function _setGerando(ativo, alvo = 'pdf') {
  PdfState.gerando = ativo;
  // 'pdf' (padrão) = comportamento de sempre. 'extras' trava o modal do
  // mesmo jeito, mas não mexe no rótulo/spin do botão "Gerar PDF" nem
  // esmaece a tela (o feedback fica no botão da coluna Extras).
  const doPdf = alvo === 'pdf';

  document.querySelectorAll('#pdf-disc-list input[type="checkbox"], #pdf-aulas-list input[type="checkbox"]')
    .forEach(cb => { cb.disabled = ativo; });
  document.querySelectorAll('#pdf-tipo-list [data-tipo]').forEach(b => { b.disabled = ativo; });
  const toggleSeparado = document.getElementById('pdf-separado-toggle');
  if (toggleSeparado) toggleSeparado.disabled = ativo;

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
    body.style.opacity = ativo && doPdf ? '0.45' : '';
    body.setAttribute('aria-busy', ativo ? 'true' : 'false');
  }

  const btn   = document.getElementById('pdf-generate-btn');
  const label = document.getElementById('pdf-generate-btn-label');
  if (label && doPdf) label.textContent = ativo ? 'Gerando PDF…' : 'Gerar PDF';
  if (btn) {
    btn.classList.toggle('pdf-generate-btn--loading', ativo && doPdf);
    // Fora da geração, o botão continua seguindo a mesma regra de
    // sempre (só habilitado com pelo menos 1 item selecionado).
    btn.disabled = ativo || _contarSelecionadas() === 0;
  }

  // Coluna Extras: travada durante qualquer geração/download.
  document.querySelectorAll('#pdf-extras input[type="checkbox"]').forEach(cb => { cb.disabled = ativo; });
  const eBtn = document.getElementById('pdf-extras-baixar');
  if (eBtn) {
    eBtn.classList.toggle('pdf-extras__btn--loading', ativo && alvo === 'extras');
    if (ativo) {
      eBtn.disabled = true;
      const eLabel = eBtn.querySelector('.pdf-extras__btn-label');
      if (eLabel && alvo === 'extras') eLabel.textContent = 'Baixando…';
    } else {
      _syncBotaoExtras();
    }
  }
}

/* ══════════════════════════════════════════════
   GERAR PDF — no desktop, gera o mesmo PDF de sempre e
   abre uma aba de visualização (ver comentário de
   _isMobileDevice em resumo-pdf-viewer.js). No mobile,
   gera o mesmo PDF e manda direto para download, sem aba
   nova.

   Com "Baixar separado por disciplina" ligado (PdfState.
   porDisciplina) e mais de 1 disciplina com conteúdo
   selecionado, o fluxo desvia para _gerarPdfsSeparados en
   vez de _gerarPdfUnico — ver comentário de cada uma.
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

  // Com só 1 disciplina de conteúdo selecionado, "separado" e "único"
  // produzem exatamente o mesmo arquivo — nesse caso mantém o fluxo de
  // sempre (aba de visualização no desktop), em vez de forçar o
  // caminho de download direto só porque o toggle está marcado.
  const separado = PdfState.porDisciplina && grupos.length > 1;

  // Abre a aba já no clique (síncrono), antes de qualquer await, para
  // não ser bloqueada como pop-up pelo navegador. Só o fluxo de PDF
  // ÚNICO abre essa aba: no modo separado seriam N disciplinas = N
  // abas, e só a 1ª aberta de forma síncrona escaparia do bloqueio de
  // pop-up do navegador — as demais seriam bloqueadas silenciosamente.
  // Por isso _gerarPdfsSeparados nunca abre aba, só baixa cada PDF
  // direto (ver seu comentário).
  const win = (!separado && !mobile) ? window.open('', '_blank') : null;
  if (win) {
    _abrirVisualizador(win, _buildLoadingHTML());
  }

  try {
    await _carregarPdfMake();

    if (separado) {
      await _gerarPdfsSeparados(grupos);
    } else {
      await _gerarPdfUnico(grupos, mobile, win);
    }
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

/* PDF ÚNICO — comportamento de sempre, só extraído de dentro de
   _onGenerate para poder conviver com _gerarPdfsSeparados sem
   duplicar a lógica de mobile/aba/blob. Nada mudou aqui: mesmo
   _buildDocDefinition, mesmo _buildNomeArquivo, mesmo caminho de
   download direto no mobile / aba de visualização no desktop. */
async function _gerarPdfUnico(grupos, mobile, win) {
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
}

/* PDFs SEPARADOS POR DISCIPLINA — 1 arquivo por disciplina
   selecionada, cada um só com o conteúdo (tipos/aulas) daquela
   disciplina. A separação é SEMPRE por disciplina, nunca por modo ou
   por aula: se uma disciplina tem vários tipos/aulas marcados, todos
   continuam juntos dentro do PDF daquela disciplina — é por isso que
   chamamos _buildDocDefinition com `[grupo]` (array de 1 elemento),
   nunca desmontando `grupo.itensPorAula`/`grupo.outros` por conta
   própria.

   `grupos` já vem de _disciplinasSelecionadasOrdenadas() — o mesmo
   identificador de disciplina (disc.id) que todo o resto do modal usa
   para marcar/desmarcar (PdfState.discIds, PdfState.aulaSel etc.) —
   então a divisão abaixo usa exatamente a mesma fonte de verdade,
   nunca nome ou índice de exibição.

   Reaproveita a MESMA _buildDocDefinition de sempre — para ela, um
   array com 1 disciplina é indistinguível de quando o usuário já
   selecionava só 1 disciplina no modo único (mesmo cabeçalho, mesma
   capa/sumário de 1 disciplina só). Nenhuma aba de visualização é
   aberta aqui (ver o comentário em _onGenerate sobre bloqueio de
   pop-up); cada PDF vai direto para download, sequencialmente, com a
   mesma _baixarBlobDireto já usada no fluxo mobile.

   NOME DO ARQUIVO: reaproveita a MESMA _buildNomeArquivo usada no PDF
   único — chamada aqui com `[grupo]` (array de 1 disciplina), que é
   exatamente a mesma entrada que ela já recebe quando o usuário baixa
   1 disciplina isolada no modo único (ex.: "LEGISLACAO_SINTESE.pdf").
   Nenhuma regra de nomenclatura nova: é a função original decidindo,
   sozinha, o nome — ela já sabe montar DISC_MODO.pdf a partir de 1
   grupo só, então não há nada a duplicar aqui. */
async function _gerarPdfsSeparados(grupos) {
  const tiposAtivos = ALL_TIPOS.filter(t => PdfState.tipos.has(t));

  for (const grupo of grupos) {
    const docDefinition = await _buildDocDefinition([grupo], tiposAtivos);
    const nomeArquivo = _buildNomeArquivo([grupo]);
    const blob = await new Promise(resolve => window.pdfMake.createPdf(docDefinition).getBlob(resolve));
    _baixarBlobDireto(blob, nomeArquivo);
  }

  _fecharModalPdf();
}

/* ══════════════════════════════════════════════
   DOWNLOAD DOS EXTRAS — arquivos no formato original
   Nome: [DISCIPLINA_]Mapa_mental_Titulo.ext (ou Video_Titulo.ext),
   a mesma convenção do botão "Baixar" dos cards do modo Extra. O
   prefixo da disciplina só entra quando há mais de uma disciplina no
   download, para não misturar/colidir arquivos de disciplinas
   diferentes (os downloads saem disciplina por disciplina, em ordem).
   A extensão é sempre a do arquivo real (vem do caminho resolvido).

   COMO BAIXA: o atributo `download` só é respeitado pelo navegador
   quando o arquivo é do MESMO domínio do site.
   • mesmo domínio → <a download> direto (sem carregar o arquivo na
     memória — importante para vídeos grandes);
   • outro domínio (ex.: R2/CDN) → fetch → Blob → download com o nome
     certo. Isso exige CORS liberado no host para a origem do site;
     sem CORS o navegador bloqueia a leitura, o arquivo NÃO é baixado
     e é listado no aviso final (nunca abre aba nem finge sucesso).
══════════════════════════════════════════════ */
const _MIME_EXT = {
  'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp', 'image/gif': '.gif',
  'image/svg+xml': '.svg', 'video/mp4': '.mp4', 'video/webm': '.webm', 'video/quicktime': '.mov',
  'application/pdf': '.pdf',
};

function _slugExtra(txt) {
  return String(txt ?? '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim().replace(/[\s-]+/g, '_');
}

function _nomeArquivoExtra(arq, disc) {
  const prefixo = arq.cat === 'videos' ? 'Video' : 'Mapa_mental';
  const partes = [
    disc ? _sanitizarNomeArquivo(disc.apelido ?? disc.nome) : '',
    prefixo,
    _slugExtra(arq.titulo),
  ].filter(Boolean);
  return partes.join('_') + _extExtra(arq.url);
}

function _disparar(href, nome) {
  const a = document.createElement('a');
  a.href = href;
  a.download = nome;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/* Retorna { ok, motivo }. */
async function _baixarArquivoExtra(url, nome) {
  const abs = new URL(url, location.href);

  if (abs.origin === location.origin) {
    _disparar(abs.href, nome);
    return { ok: true };
  }

  try {
    const r = await fetch(abs.href, { mode: 'cors', cache: 'no-cache' });
    if (!r.ok) return { ok: false, motivo: `HTTP ${r.status}` };
    const blob = await r.blob();
    const nomeFinal = /\.[a-z0-9]{2,5}$/i.test(nome) ? nome : nome + (_MIME_EXT[blob.type] ?? '');
    _baixarBlobDireto(blob, nomeFinal);
    return { ok: true };
  } catch (err) {
    console.error('[Resumo PDF/Extras] Download falhou (provável CORS):', abs.href, err);
    return { ok: false, motivo: 'bloqueado pelo navegador (CORS)' };
  }
}

const _pausa = ms => new Promise(r => setTimeout(r, ms));

async function _onGenerateExtras() {
  if (PdfState.gerando) return;

  const grupos = _extrasSelecionadosPorDisciplina();
  if (!grupos.length) return;

  playSound('click', 'resumos');
  _setGerando(true, 'extras');
  _avisarSeOrigemInsegura();

  const multiDisc = grupos.length > 1;
  const usados = new Set();
  const falhas = [];
  let primeiro = true;

  try {
    for (const g of grupos) {
      for (const arq of g.arquivos) {
        // Pequeno intervalo: navegadores tratam vários downloads
        // seguidos como suspeitos e podem bloquear os seguintes.
        if (!primeiro) await _pausa(450);
        primeiro = false;

        let nome = _nomeArquivoExtra(arq, multiDisc ? g.disc : null);
        if (usados.has(nome)) {                       // mesmo título na mesma disciplina
          const ext = _extExtra(arq.url);
          const base = ext ? nome.slice(0, -ext.length) : nome;
          let n = 2;
          while (usados.has(`${base}_${n}${ext}`)) n++;
          nome = `${base}_${n}${ext}`;
        }
        usados.add(nome);

        const res = await _baixarArquivoExtra(arq.url, nome);
        if (!res.ok) falhas.push(`${nome} — ${res.motivo}`);
      }
    }
  } catch (err) {
    console.error('[Resumo PDF/Extras] Falha ao baixar extras:', err);
    alert('Não foi possível baixar os conteúdos extras. Tente novamente.');
  } finally {
    _setGerando(false, 'extras');
  }

  if (falhas.length) {
    alert(
      `${falhas.length} arquivo${falhas.length !== 1 ? 's' : ''} não ${falhas.length !== 1 ? 'puderam' : 'pôde'} ser baixado${falhas.length !== 1 ? 's' : ''}:\n\n` +
      falhas.slice(0, 6).join('\n') + (falhas.length > 6 ? `\n… e mais ${falhas.length - 6}.` : '') +
      '\n\nSe o erro for CORS, o host dos arquivos (ex.: R2) precisa liberar a origem deste site.'
    );
    return;
  }

  // O modal continua aberto (o PDF é a tarefa principal): só confirma no botão.
  const label = document.querySelector('#pdf-extras-baixar .pdf-extras__btn-label');
  if (label) {
    label.textContent = 'Arquivos baixados';
    setTimeout(_syncBotaoExtras, 1800);
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
  _ensureSeparadoToggleUI();
  _ensureExtrasUI();

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