/* ═══════════════════════════════════════════════════════════════
   NEXUS STUDY — games/template/nx-som.js   (NOVO)

   Som e botão de efeito sonoro DENTRO dos 21 jogos (estudo + entretenimento).

   1) Botão flutuante de EFEITO SONORO (o mesmo do hub e do resto do site:
      shared/js/audio/ui/audio-btns.js). O botão da IA NÃO é carregado aqui.
      Nos jogos de estudo ele já existia; nos de entretenimento passa a existir.
      Respeita a opção "botão de som" das Configurações (se o usuário a
      desligou, o botão não aparece).
   2) Som nos botões do topo: Voltar e Nexus tocam 'hover' ao passar o mouse
      e 'click' ao clicar, igual ao logo do hub (playSound, área "game").
   3) Estilo do botão: o CSS compartilhado (audio-btns.css) e o ajuste de
      tamanho (game-botoes-flutuantes.css) são carregados por aqui, então
      cada página só precisa de UMA linha:
        <script type="module" src="…/games/template/nx-som.js"></script>

   Importante: o botão controla os sons COMPARTILHADOS do Nexus (como os
   dos botões Voltar/Nexus). Os efeitos do próprio jogo de entretenimento
   continuam sob o botão de som do topo do jogo.
   Não importa zoom.js (aplicaria 80 % de zoom na interface do jogo).
═══════════════════════════════════════════════════════════════ */

import { Sound, audio, playSound, installAudioRecovery } from '../../shared/js/audio/audio-api.js';

const AREA = 'game';
const DEMORA_NAVEGACAO_MS = 140;           // deixa o som de clique terminar antes de trocar de página

function _css(href) {
  const nome = href.split('/').pop();
  const ja = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some((l) => (l.getAttribute('href') || '').split('?')[0].endsWith(nome));
  if (ja) return;
  const l = document.createElement('link');
  l.rel = 'stylesheet'; l.href = href;
  document.head.appendChild(l);
}

function _montar() {
  _css(new URL('../../shared/css/audio/audio-btns.css', import.meta.url).href);
  _css(new URL('./game-botoes-flutuantes.css', import.meta.url).href);
  document.body.classList.add('nx-jogos');         // ativa o ajuste de tamanho (40,4 px)
  /* Jogos de entretenimento não têm o botão da IA: o de som desce para o canto (lugar que a IA ocuparia) */
  if (location.pathname.includes('/jogos/entretenimento/')) document.body.classList.add('nx-sem-ia');

  try { Sound.init(); installAudioRecovery({ Sound, audio }); }
  catch (e) { console.warn('[nx-som] botão de som não iniciou:', e); }

  window.__nxSom = { hover: 0, click: 0 };          // contadores (usados pelo teste t_v4.py)

  /* Botões do topo: Voltar (1º item do .nx-nav) e Nexus (.nx-nav__home) */
  const ALVO = '.nx-nav > :not(.nx-nav__home), .nx-nav__home';
  const alvo = (el) => (el && el.closest ? el.closest(ALVO) : null);

  document.addEventListener('mouseover', (e) => {
    const a = alvo(e.target);
    if (!a || (e.relatedTarget && a.contains(e.relatedTarget))) return;
    window.__nxSom.hover++; playSound('hover', AREA);
  });
  document.addEventListener('pointerdown', (e) => {
    if (e.button > 0 || !alvo(e.target)) return;
    window.__nxSom.click++; playSound('click', AREA);
  });
  /* Link comum (mesma aba, sem Ctrl/Shift/Alt/Meta): espera o som terminar e então navega. */
  document.addEventListener('click', (e) => {
    const a = alvo(e.target);
    if (!a || a.tagName !== 'A' || e.defaultPrevented || e.button > 0 || e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;
    if (a.target && a.target !== '_self') return;
    const href = a.href; if (!href) return;
    e.preventDefault();
    setTimeout(() => { location.href = href; }, DEMORA_NAVEGACAO_MS);
  }, true);
}

if (document.body) _montar(); else document.addEventListener('DOMContentLoaded', _montar, { once: true });
