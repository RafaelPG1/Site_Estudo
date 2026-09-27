/* ============================================================
   NEXUS STUDY — shared/js/utils/zoom.js  (v3.1)
   ============================================================ */

// ═══ ZOOM POR ÁREA ═════════════════════════════════════════
//
// Cada área da aplicação (Home, Resumo, Quiz, Games, Pessoal...)
// tem seu próprio nível de zoom. O valor padrão de cada área fica
// explícito em ZOOM_POR_AREA, abaixo — edite ali para personalizar.
// Se o usuário alterar o zoom em uma área, o valor escolhido é
// salvo separadamente e passa a ter prioridade sobre o padrão.
//
// A identificação de área (getAreaFromPath) foi movida para cá
// porque logo.js já importa este módulo (para aplicar o zoom como
// side-effect ao carregar) — assim logo.js pode importar a função
// daqui sem gerar dependência circular entre os dois arquivos.
//
// ─────────────────────────────────────────────────────────────
// ÁREA 'resumos' vs ÁREA 'resumo_pdf' — são DUAS áreas distintas
// e independentes, apesar do nome parecido:
//
//   'resumos'    → Resumo NORMAL do sistema (Home, leitura de
//                  aula, conteúdo do reader). Ligada a rota via
//                  getAreaFromPath()/_AREA_MAP, aplicada como
//                  zoom da página inteira (document.documentElement),
//                  exatamente como sempre funcionou.
//
//   'resumo_pdf' → EXCLUSIVA do visualizador de PDF gerado por
//                  resumo/js/resumo-pdf.js (aba própria, aberta via
//                  Blob URL). NUNCA é atingida por getAreaFromPath()
//                  (essa aba não roda sob uma rota do site) e NUNCA
//                  deve ser lida/gravada pelo código da área
//                  'resumos'. Ver getZoomResumoPdf/setZoomResumoPdf
//                  no fim deste arquivo.
//
// As duas vivem no mesmo objeto salvo em localStorage (mesmo padrão
// de todas as áreas: uma chave por área, dentro do mesmo storage),
// mas cada uma só é lida/escrita pelas suas próprias funções — nunca
// há leitura/gravação cruzada entre elas.
// ─────────────────────────────────────────────────────────────

/* ── Zoom padrão de cada área — edite aqui para personalizar ── */
const ZOOM_POR_AREA = {
  inicial: 85,
  resumos: 84,
  quiz:    75,
  quiz_questoes: 110,
  game:    80,
  perfil:  80,
  atlas: 80,
  // Placeholder — o valor inicial real do visualizador de PDF ainda
  // será calibrado à parte (ver getZoomResumoPdf/setZoomResumoPdf).
  // Esta correção só separa a área; não define o valor final.
  resumo_pdf: 135,
};

const STORAGE_KEY = 'nexus_zoom_por_area';

/* ── Identificação de área (antes vivia em logo.js) ──────────
   Mesmo mapeamento de rotas → área já usado em produção pelo
   logo.js para o playSound por área.

   IMPORTANTE: 'resumo_pdf' não entra neste mapa de propósito — o
   visualizador de PDF não é uma rota do site (é uma aba própria,
   aberta via Blob URL, sem module import deste arquivo), então
   nunca deve ser resolvido a partir de window.location.pathname. */
const _AREA_MAP = [
  { match: /\/quiz\//,      area: 'quiz'    },
  { match: /\/resumo\//,    area: 'resumos' },
  { match: /\/games?\//,    area: 'game'    },
  { match: /\/dashboard\//, area: 'perfil' },
  { match: /\/admin\//,     area: 'inicial' },
  { match: /\/atlas\//, area: 'atlas' },
];

export function getAreaFromPath(path = window.location.pathname) {
  for (const { match, area } of _AREA_MAP) {
    if (match.test(path)) return area;
  }
  return 'inicial';
}

/* ── Persistência por área ───────────────────────────────────
   Um único objeto no localStorage, uma entrada por área.
   Leitura é defensiva: qualquer formato inesperado cai em {}. */
function _lerSalvos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const obj = raw ? JSON.parse(raw) : null;
    return (obj && typeof obj === 'object' && !Array.isArray(obj)) ? obj : {};
  } catch (_) {
    return {};
  }
}

function _salvar(area, valor) {
  const salvos = _lerSalvos();
  salvos[area] = valor;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(salvos));
  } catch (_) {}
}

/* Valor efetivo de uma área: salvo pelo usuário > padrão da área. */
function _zoomDaArea(area) {
  const salvos = _lerSalvos();
  return salvos[area] ?? ZOOM_POR_AREA[area] ?? ZOOM_POR_AREA.inicial;
}

/* ── Aplicação ────────────────────────────────────────────── */
function _aplicarZoom(valor) {
  document.documentElement.style.zoom = `${valor}%`;
}

/* ── Aplicação escopada (não em documentElement) ─────────────
   Usada para zooms que devem afetar SOMENTE um elemento interno,
   como o conteúdo das questões do Quiz — nunca a página inteira. */
function _aplicarZoomEm(elemento, valor) {
  if (!elemento) return;
  elemento.style.zoom = `${valor}%`;
}

/* ── Auto-aplicação ao carregar (side-effect do import) ──────
   Igual ao comportamento original — o zoom é aplicado assim que o
   módulo é importado — mas agora usando o valor da área atual.
   Continua resolvendo SOMENTE áreas de rota (getAreaFromPath), então
   'resumo_pdf' nunca é aplicada por aqui (ver comentário acima). */
(() => {
  const area = getAreaFromPath();
  _aplicarZoom(_zoomDaArea(area));
})();

/* ── API pública ──────────────────────────────────────────── */

export function getZoomAtual() {
  return _zoomDaArea(getAreaFromPath());
}

export function setZoomAtual(valor) {
  const area = getAreaFromPath();
  _salvar(area, valor);
  _aplicarZoom(valor);
}

/* ── API pública — zoom do conteúdo das questões (Quiz) ──────
   Área fixa 'quiz_questoes', independente de getAreaFromPath().
   Lê/salva no mesmo storage por área, mas aplica apenas no
   elemento recebido, nunca no <html>. */

export function getZoomQuestoes() {
  return _zoomDaArea('quiz_questoes');
}

export function setZoomQuestoes(valor, seletorOuElemento = '#quiz-container') {
  _salvar('quiz_questoes', valor);
  aplicarZoomQuestoes(seletorOuElemento, valor);
}

export function aplicarZoomQuestoes(seletorOuElemento = '#quiz-container', valor) {
  const elemento = typeof seletorOuElemento === 'string'
    ? document.querySelector(seletorOuElemento)
    : seletorOuElemento;

  if (!elemento) return;

  const zoomFinal = valor ?? getZoomQuestoes();
  _aplicarZoomEm(elemento, zoomFinal);
}

/* ── API pública — zoom do visualizador de PDF (resumo_pdf) ──
   Área fixa 'resumo_pdf', completamente independente da área
   'resumos' (Resumo normal) — mesmo storage (nexus_zoom_por_area),
   propriedade própria, nunca lida/gravada por getZoomAtual/
   setZoomAtual nem pelo auto-apply acima.

   Só get/set de valor: não existe "aplicar no documentElement" nem
   "aplicar num elemento" aqui, porque o visualizador de PDF é um
   DOCUMENTO SEPARADO (aba própria, aberta via Blob URL a partir de
   resumo/js/resumo-pdf.js) — ele não roda no mesmo `document` deste
   módulo e faz seu próprio controle de escala (re-render das páginas
   no PDF.js), não um `style.zoom`. Por isso o visualizador guarda seus
   ajustes de zoom escrevendo diretamente no mesmo localStorage/mesma
   área 'resumo_pdf' (ver resumo/js/resumo-pdf-viewer.js) — este par
   de funções é o que o restante do site (fora da aba do visualizador)
   usa para ler/gravar esse mesmo valor, ex.: o zoom inicial calculado
   por resumo-pdf.js antes de abrir a aba. */

export function getZoomResumoPdf() {
  return _zoomDaArea('resumo_pdf');
}

export function setZoomResumoPdf(valor) {
  _salvar('resumo_pdf', valor);
}