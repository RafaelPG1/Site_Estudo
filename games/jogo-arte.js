/**
 * NEXUS STUDY — games/jogo-arte.js   (NOVO)
 *
 * Ilustrações e ícones da central de jogos, todos em SVG inline.
 * Cada arte usa `currentColor` (a cor do jogo, definida no card pela
 * variável --c) e o fundo escuro da página, então trocar a cor de um
 * jogo não exige redesenhar nada.
 *
 * Para um jogo novo: adicione uma chave em ARTE (ou deixe sem arte —
 * o card cai em ARTE.padrao) e referencie-a em `arte:` no catálogo
 * de jogo.js.
 */

const FUNDO = '#0d0f16';

export const ARTE = {
  /* Cartas empilhadas: frente e verso */
  flashcard: `
    <rect x="86" y="40" width="140" height="100" rx="14" transform="rotate(-10 156 90)" fill="currentColor" opacity=".16"/>
    <rect x="98" y="46" width="140" height="100" rx="14" transform="rotate(6 168 96)" fill="currentColor" opacity=".3"/>
    <rect x="92" y="54" width="140" height="100" rx="14" fill="${FUNDO}" stroke="currentColor" stroke-width="2"/>
    <path d="M114 82h58M114 98h96M114 114h44" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="206" cy="130" r="9" fill="currentColor" opacity=".9"/>`,

  /* Dois cartões lado a lado: certo e errado */
  vdd_falso: `
    <rect x="52" y="54" width="104" height="104" rx="20" fill="currentColor" opacity=".9"/>
    <path d="M82 106l17 17 31-36" fill="none" stroke="${FUNDO}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="168" y="54" width="104" height="104" rx="20" fill="${FUNDO}" stroke="currentColor" stroke-width="2" opacity=".85"/>
    <path d="M200 86l40 40M240 86l-40 40" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round" opacity=".7"/>`,

  /* Linhas de texto com uma lacuna a preencher */
  completar_frase: `
    <rect x="52" y="52" width="216" height="104" rx="16" fill="${FUNDO}" stroke="currentColor" stroke-opacity=".35" stroke-width="2"/>
    <path d="M76 82h120M76 128h168" stroke="currentColor" stroke-width="5" stroke-linecap="round" opacity=".4"/>
    <path d="M76 105h52" stroke="currentColor" stroke-width="5" stroke-linecap="round" opacity=".4"/>
    <rect x="138" y="92" width="64" height="26" rx="8" fill="currentColor" opacity=".18" stroke="currentColor" stroke-width="2" stroke-dasharray="5 4"/>
    <path d="M212 105h32" stroke="currentColor" stroke-width="5" stroke-linecap="round" opacity=".4"/>
    <path d="M160 100v10" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`,

  /* Degraus até o topo, com uma estrela no último */
  show_milhao: `
    <rect x="44"  y="128" width="38" height="28"  rx="6" fill="currentColor" opacity=".22"/>
    <rect x="88"  y="110" width="38" height="46"  rx="6" fill="currentColor" opacity=".34"/>
    <rect x="132" y="92"  width="38" height="64"  rx="6" fill="currentColor" opacity=".5"/>
    <rect x="176" y="74"  width="38" height="82"  rx="6" fill="currentColor" opacity=".7"/>
    <rect x="220" y="56"  width="56" height="100" rx="6" fill="currentColor"/>
    <path d="M248 68l5.2 10.6 11.8 1.7-8.5 8.3 2 11.7-10.5-5.5-10.5 5.5 2-11.7-8.5-8.3 11.8-1.7z" fill="${FUNDO}"/>`,

  /* Duas colunas ligadas por pares */
  associacao: `
    <path d="M96 62C150 62 170 106 224 106M96 106C150 106 170 150 224 150M96 150C150 150 170 62 224 62" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity=".55"/>
    <circle cx="96"  cy="62"  r="13" fill="currentColor"/>
    <circle cx="96"  cy="106" r="13" fill="currentColor" opacity=".7"/>
    <circle cx="96"  cy="150" r="13" fill="currentColor" opacity=".45"/>
    <circle cx="224" cy="62"  r="13" fill="${FUNDO}" stroke="currentColor" stroke-width="3"/>
    <circle cx="224" cy="106" r="13" fill="${FUNDO}" stroke="currentColor" stroke-width="3"/>
    <circle cx="224" cy="150" r="13" fill="${FUNDO}" stroke="currentColor" stroke-width="3"/>`,

  /* Reserva para jogos sem arte própria */
  padrao: `
    <rect x="70" y="62" width="180" height="84" rx="28" fill="${FUNDO}" stroke="currentColor" stroke-width="2.5"/>
    <path d="M108 104h36M126 86v36" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>
    <circle cx="192" cy="94" r="7" fill="currentColor"/>
    <circle cx="214" cy="114" r="7" fill="currentColor" opacity=".6"/>`,
};

/* ── Miniaturas dos jogos de entretenimento (pixel/traço, vindas da biblioteca original) ── */
const px = (rows, s = 8) => rows.flatMap((r, y) => [...r].map((c, x) =>
  c === '1' ? `<rect x="${x * s}" y="${y * s}" width="${s - 1}" height="${s - 1}" rx="1.5"/>` : '')).join('');
const svg = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" fill="currentColor" aria-hidden="true">${body}</svg>`;
const INVADER = ['00100000100','00010001000','00111111100','01101110110','11111111111','10111111101','10100000101','00011011000'];
const LINE = 'fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"';

// Arte padrão por categoria (também usada nas vagas "Em breve").
const ART_CATEGORIA = {
  arcade: () => svg(88, 64, px(INVADER)),
  puzzle: () => svg(96, 64, [[0,0],[24,0],[48,0],[24,24],[0,24],[72,24],[48,48],[72,48]].map(([x, y], i) =>
    `<rect x="${x + 1}" y="${y + 1}" width="22" height="22" rx="5" opacity="${i % 3 ? .55 : 1}"/>`).join('')),
  classicos: () => svg(100, 64, '<rect x="4" y="16" width="8" height="26" rx="3"/><rect x="88" y="26" width="8" height="26" rx="3"/><circle cx="56" cy="30" r="5"/><path d="M50 4v56" stroke="currentColor" stroke-width="2" stroke-dasharray="4 6" opacity=".4"/>'),
  estrategia: () => svg(100, 72, [[30,22],[70,22],[50,56]].map(([x, y], i) =>
    `<polygon points="${[0,1,2,3,4,5].map(k => `${(x + 20 * Math.cos(k * Math.PI / 3 + Math.PI / 6)).toFixed(1)},${(y + 20 * Math.sin(k * Math.PI / 3 + Math.PI / 6)).toFixed(1)}`).join(' ')}" opacity="${i === 1 ? 1 : .5}"/>`).join('')),
  casual: () => svg(96, 64, '<circle cx="24" cy="38" r="18"/><circle cx="58" cy="26" r="14" opacity=".6"/><circle cx="76" cy="46" r="10" opacity=".85"/><circle cx="44" cy="10" r="6" opacity=".5"/>')
};

// Arte própria de cada jogo. Chave = id do jogo.
const GAME_ART = {
  'flappy_bird': () => svg(100, 64, '<rect x="84" y="0" width="12" height="20" rx="3" opacity=".4"/><rect x="82" y="16" width="16" height="6" rx="2" opacity=".4"/><rect x="84" y="44" width="12" height="20" rx="3" opacity=".4"/><rect x="82" y="42" width="16" height="6" rx="2" opacity=".4"/>' +
    '<ellipse cx="40" cy="34" rx="21" ry="17"/><ellipse cx="32" cy="39" rx="11" ry="7" fill="var(--bg)" opacity=".45" transform="rotate(-20 32 39)"/>' +
    '<path d="M58 29l15 5-15 6z" opacity=".7"/><circle cx="49" cy="27" r="5" fill="var(--bg)"/><circle cx="50.6" cy="27" r="2"/>'),
  'jumpy': () => svg(100, 64, '<rect x="14" y="52" width="40" height="8" rx="4" opacity=".5"/><rect x="50" y="36" width="36" height="8" rx="4" opacity=".75"/><rect x="18" y="20" width="30" height="8" rx="4" opacity=".5"/><circle cx="66" cy="29" r="6"/><circle cx="66" cy="19" r="4"/>'),
  'tetris': () => svg(63, 54, px(['0011100','0001000','0000000','1100000','1101110','1111110'], 9)),
  'breakout': () => svg(100, 66, [0,1,2].flatMap(r => [0,1,2,3,4].map(c =>
    `<rect x="${c * 19 + 2}" y="${r * 10 + 2}" width="17" height="8" rx="2" opacity="${1 - r * .25}"/>`)).join('') + '<circle cx="54" cy="46" r="4"/><rect x="36" y="58" width="30" height="5" rx="2.5"/>'),
  'stack_tower': () => svg(100, 64, [[30,50],[24,38],[34,26],[28,14],[32,2]].map(([x, y], i) =>
    `<rect x="${x}" y="${y}" width="40" height="10" rx="2" opacity="${.45 + i * .14}"/>`).join('')),
  'snake': () => svg(100, 64, `<path d="M12 50H44V32H72V14H86" ${LINE} stroke-width="9"/><circle cx="88" cy="14" r="7"/><circle cx="20" cy="16" r="4" opacity=".6"/>`),
  'memory_match': () => svg(100, 64, '<rect x="12" y="8" width="34" height="48" rx="6" opacity=".5" transform="rotate(-8 29 32)"/><rect x="54" y="8" width="34" height="48" rx="6"/><circle cx="71" cy="32" r="9" fill="var(--bg)"/>'),
  'slide_puzzle': () => svg(64, 64, [...Array(8).keys()].map(i =>
    `<rect x="${(i % 3) * 22}" y="${Math.floor(i / 3) * 22}" width="20" height="20" rx="4" opacity="${i % 2 ? .55 : 1}"/>`).join('')),
  'water_sort': () => svg(92, 64, [[1, .55, 1], [.55, .55], [1]].map((layers, i) => {
    const x = 6 + i * 30;
    return `<rect x="${x}" y="4" width="24" height="56" rx="12" ${LINE.replace('none', 'none')} stroke-width="2" opacity=".7"/>` +
      layers.map((o, j) => `<rect x="${x + 4}" y="${46 - j * 12}" width="16" height="11" rx="${j ? 2 : 6}" opacity="${o}"/>`).join('');
  }).join('')),
  'campo_minado': () => svg(64, 64, [...Array(9).keys()].map(i => `<rect x="${(i % 3) * 22}" y="${Math.floor(i / 3) * 22}" width="20" height="20" rx="3" opacity="${i === 4 || i === 6 ? .9 : .28}"/>`).join('') +
    '<g fill="var(--bg)"><circle cx="32" cy="32" r="5"/></g><path d="M32 23v18M23 32h18M26 26l12 12M38 26L26 38" stroke="var(--bg)" stroke-width="2" stroke-linecap="round"/><path d="M8 59V46M8 46l8 3.5-8 3.5" stroke="var(--bg)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="var(--bg)"/>'),
  'sokoban': () => svg(66, 66, '<rect x="0" y="0" width="66" height="14" rx="3" opacity=".35"/><rect x="0" y="52" width="66" height="14" rx="3" opacity=".35"/><rect x="0" y="14" width="14" height="38" opacity=".35"/>' +
    '<rect x="26" y="22" width="22" height="22" rx="3"/><path d="M30 26l14 14M44 26L30 40" stroke="var(--bg)" stroke-width="2.4" stroke-linecap="round"/><circle cx="56" cy="33" r="5" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="19" cy="33" r="5" opacity=".7"/>'),
  'jogo_velha': () => svg(66, 66, `<path d="M22 4v58M44 4v58M4 22h58M4 44h58" ${LINE} stroke-width="3" opacity=".45"/><path d="M8 8l10 10M18 8L8 18" ${LINE} stroke-width="4"/><circle cx="33" cy="33" r="7" ${LINE.replace('none', 'none')} stroke-width="4"/><path d="M48 48l10 10M58 48L48 58" ${LINE} stroke-width="4"/>`),
  'batalha_naval': () => svg(100, 64, `<path d="M8 40h84l-12 14H22z"/><rect x="36" y="26" width="26" height="14" rx="2" opacity=".6"/><rect x="46" y="14" width="6" height="12" rx="1"/><path d="M6 60q9-6 18 0t18 0 18 0 18 0 18 0" ${LINE} stroke-width="3" opacity=".45"/>`),
  'solitario': () => svg(88, 64, '<rect x="10" y="8" width="38" height="52" rx="6" opacity=".45" transform="rotate(-9 29 34)"/><rect x="40" y="6" width="38" height="52" rx="6"/>' +
    '<text x="48" y="24" font-size="15" font-weight="800" font-family="system-ui,sans-serif" fill="var(--bg)">A</text><path d="M59 28l9 11-9 11-9-11z" fill="var(--bg)"/>'),
  'pac_man': () => svg(100, 64, `<path d="M4 20h30M50 20h46M4 44h46M66 44h30M34 20v14M66 20v14" ${LINE} stroke-width="4" opacity=".4"/><path d="M26 32L38 22a13 13 0 1 0 0 20z" transform="translate(6 0)"/><circle cx="58" cy="32" r="3" opacity=".8"/><circle cx="72" cy="32" r="3" opacity=".8"/><circle cx="86" cy="32" r="3" opacity=".8"/>`),
  'piano_tap': () => svg(92, 64, ['0100', '0001', '1000', '0010'].flatMap((row, r) => [...row].map((c, k) =>
    `<rect x="${k * 23}" y="${r * 16}" width="21" height="14" rx="3" ${c === '1' ? '' : 'opacity=".25"'}/>`)).join(''))
};


export function arteSvg(chave, subcategoria) {
  const mini = GAME_ART[chave] ?? (subcategoria && ART_CATEGORIA[subcategoria]);
  if (mini) return `<div class="card__mini" role="presentation" aria-hidden="true">${mini()}</div>`;
  const corpo = ARTE[chave] ?? ARTE.padrao;
  return `<svg class="card__svg" viewBox="0 0 320 200" role="presentation" aria-hidden="true" focusable="false">${corpo}</svg>`;
}

/* Ícones de interface — traço 1.75, um único estilo para a página toda. */
const _ico = (d, extra = '') =>
  `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" ${extra}>${d}</svg>`;

export const ICONE = {
  play:    _ico('<path d="M7 4.8v14.4a.8.8 0 001.2.7l11.4-7.2a.8.8 0 000-1.4L8.2 4.1A.8.8 0 007 4.8z" fill="currentColor" stroke="none"/>'),
  relogio: _ico('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  fechar:  _ico('<path d="M6 6l12 12M18 6L6 18"/>'),
  voltar:  _ico('<path d="M15 18l-6-6 6-6"/>'),
  gamepad: _ico('<rect x="2.5" y="7" width="19" height="11" rx="4"/><path d="M8 10.5v4M6 12.5h4"/><circle cx="15.5" cy="11.5" r=".6" fill="currentColor"/><circle cx="17.7" cy="13.7" r=".6" fill="currentColor"/>'),
  engrenagem: _ico('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/>'),
  livro:   _ico('<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>'),
};
