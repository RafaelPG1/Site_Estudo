/* ============================================================
   NEXUS STUDY — shared/js/utils/zoom.js  (v3.0)
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

/* ── Zoom padrão de cada área — edite aqui para personalizar ── */
const ZOOM_POR_AREA = {
  inicial: 85,
  resumos: 84,
  quiz:    75,
  game:    80,
  perfil:  80,
  atlas: 80,
};

const STORAGE_KEY = 'nexus_zoom_por_area';

/* ── Identificação de área (antes vivia em logo.js) ──────────
   Mesmo mapeamento de rotas → área já usado em produção pelo
   logo.js para o playSound por área. */
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

/* ── Auto-aplicação ao carregar (side-effect do import) ──────
   Igual ao comportamento original — o zoom é aplicado assim que o
   módulo é importado — mas agora usando o valor da área atual. */
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