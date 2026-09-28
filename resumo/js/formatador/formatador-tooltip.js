/* =============================================
   NEXUS STUDY — resumo/js/formatador/formatador-tooltip.js
   Tooltip visual do Formatador (substitui o title="" do navegador).
   Uso: qualquer elemento com data-tip="texto" dentro da raiz recebe o
   tooltip. Só apresentação: não muda nenhum comportamento dos elementos.
     · hover (só em dispositivos com mouse) e foco por teclado
     · fixo em <body>, então nunca é cortado por sidebar/containers
     · vira para baixo quando não cabe em cima; nunca sai da tela
     · pointer-events: none (não atrapalha o clique)
     · em toque não aparece
   Estilo: .fmt-tip em formatador.css.
   ============================================= */

const MOUSE = window.matchMedia ? window.matchMedia('(hover: hover) and (pointer: fine)') : null;
const ATRASO = 320;      // ms até aparecer no hover (foco por teclado: imediato)
const MARGEM = 8;        // distância mínima das bordas da tela
const FOLGA = 10;        // distância entre o tooltip e o elemento

export function iniciarTooltips(raiz) {
  if (!raiz || raiz.dataset.tips) return;
  raiz.dataset.tips = '1';

  let tip = null, seta = null, alvo = null, timer = 0;

  const criar = () => {
    tip = document.createElement('div');
    tip.className = 'fmt-tip';
    tip.id = 'fmt-tip';
    tip.setAttribute('role', 'tooltip');
    seta = document.createElement('span');
    seta.className = 'fmt-tip__seta';
    tip.append(document.createElement('span'), seta);
    document.body.appendChild(tip);
  };

  const esconder = () => {
    clearTimeout(timer);
    if (alvo) alvo.removeAttribute('aria-describedby');
    alvo = null;
    tip?.classList.remove('is-on');
  };

  const mostrar = el => {
    const texto = el.dataset.tip;
    if (!texto) return;
    if (!tip) criar();
    alvo = el;
    el.setAttribute('aria-describedby', tip.id);
    tip.firstChild.textContent = texto;

    // mede fora de vista, depois posiciona
    tip.style.left = '0px'; tip.style.top = '0px';
    const r = el.getBoundingClientRect();
    const w = tip.offsetWidth, h = tip.offsetHeight;
    const cabeEmCima = r.top - h - FOLGA >= MARGEM;
    const lado = cabeEmCima ? 'cima' : 'baixo';
    const top = cabeEmCima ? r.top - h - FOLGA : r.bottom + FOLGA;
    const centro = r.left + r.width / 2;
    const left = Math.min(Math.max(centro - w / 2, MARGEM), Math.max(MARGEM, window.innerWidth - w - MARGEM));

    tip.dataset.lado = lado;
    tip.style.left = Math.round(left) + 'px';
    tip.style.top = Math.round(top) + 'px';
    tip.style.setProperty('--seta-x', Math.round(Math.min(Math.max(centro - left, 14), w - 14)) + 'px');
    tip.classList.add('is-on');
  };

  const agendar = el => {
    clearTimeout(timer);
    if (tip?.classList.contains('is-on')) { mostrar(el); return; }   // já aberto: troca sem atraso
    timer = setTimeout(() => mostrar(el), ATRASO);
  };

  raiz.addEventListener('mouseover', e => {
    if (!MOUSE?.matches) return;
    const el = e.target.closest('[data-tip]');
    if (!el || el === alvo) return;
    agendar(el);
  });
  raiz.addEventListener('mouseout', e => {
    const el = e.target.closest('[data-tip]');
    if (!el || el.contains(e.relatedTarget)) return;
    esconder();
  });
  raiz.addEventListener('focusin', e => {
    const el = e.target.closest?.('[data-tip]');
    if (el && el.matches(':focus-visible')) { clearTimeout(timer); mostrar(el); }
  });
  raiz.addEventListener('focusout', esconder);
  raiz.addEventListener('click', esconder);
  window.addEventListener('scroll', esconder, true);
  window.addEventListener('blur', esconder);
  window.addEventListener('resize', esconder);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') esconder(); });
}