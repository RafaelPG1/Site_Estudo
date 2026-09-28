/* =============================================
   NEXUS STUDY — resumo/js/formatador/formatador-ui.js
   Tudo o que é interface do Formatador (sem regra de negócio):
     1) Ícones e estado vazio de "Meus conteúdos"
     2) montarView()      → marcação da tela única (inclui a barra "Juntar conteúdos")
                            área principal   → Prompt e Texto (+ "Formatar texto")
                            lateral direita  → Meus conteúdos (lista preenchida por formatador.js)
     3) iniciarTooltips() → tooltip visual (data-tip), substitui o title="" do navegador
     4) confirmar()       → caixa de confirmação (substitui window.confirm)
   Estilos: .fmt*, .fmt-tip, .fmt-dialogo em css/formatador.css.
   ============================================= */

import { esc } from '../resumo-utils.js';
import { MODELOS_PROMPT, GRUPOS_MODELO } from './formatador-prompts.js';

/* ══════════════════════════════════════════════
   1) ÍCONES E ESTADO VAZIO
══════════════════════════════════════════════ */
const ICONE_SETA = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>`;
const ICONE_COPIAR = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>`;
const ICONE_DOC = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6"/><path d="M9 17h4"/></svg>`;
export const ICONE_LIXO = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg>`;

export const ICONE_JUNTAR = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 4v6a4 4 0 0 0 4 4h4"/><path d="M18 4v6a4 4 0 0 1-4 4"/><path d="M12 14v6"/><path d="M9.5 17.5 12 20l2.5-2.5"/></svg>`;

/* Estado vazio de Meus conteúdos (usado na montagem inicial e ao esvaziar a lista). */
export function htmlVazio() {
  return `
    <div class="fmt__vazio-card">
      <span class="fmt__vazio-icone">${ICONE_DOC}</span>
      <strong class="fmt__vazio-titulo">Nenhum conteúdo ainda</strong>
      <span class="fmt__vazio-txt">Quando você formatar um texto, ele aparece aqui.</span>
    </div>`;
}

/* ══════════════════════════════════════════════
   2) MARCAÇÃO DA TELA
══════════════════════════════════════════════ */

function _chips() {
  return GRUPOS_MODELO.map(g => `
    <div class="fmt__grupo">
      <span class="fmt__grupo-nome">${esc(g.rotulo)}</span>
      <div class="fmt__modelos">
        ${MODELOS_PROMPT.filter(m => m.grupo === g.id).map(m =>
          `<button type="button" class="fmt__chip" data-modelo="${esc(m.id)}" aria-pressed="false" data-tip="${esc(m.desc)}">${esc(m.nome)}</button>`
        ).join('')}
      </div>
    </div>`).join('');
}

export function montarView(host) {
  host.innerHTML = `
    <div class="fmt">
     <div class="fmt__main">
      <header class="fmt__head">
        <button type="button" class="fmt__voltar" data-fmt="voltar">${ICONE_SETA}<span>Voltar ao início</span></button>
        <h1 class="fmt__titulo">Formatador</h1>
        <p class="fmt__sub">Cole o conteúdo estruturado e clique em Formatar texto. O resultado entra em Meus conteúdos e abre no leitor do Nexus.</p>
      </header>

      <div class="fmt__principal">
          <section class="fmt__bloco" aria-labelledby="fmt-h-prompt">
            <h2 class="fmt__h" id="fmt-h-prompt">Prompt</h2>
            <p class="fmt__dica">Modelos de prompt — Resumo, Resumão e Síntese são os principais — que definem como um conteúdo deve ser organizado e já trazem a estrutura de leitura do Nexus. Escolha um ou escreva o seu; pode editar à vontade.</p>
            ${_chips()}
            <p class="fmt__modelo-desc" id="fmt-modelo-desc" hidden></p>

            <label class="fmt__lbl fmt__lbl--oculto" for="fmt-instrucao">Prompt</label>
            <textarea class="fmt__area fmt__area--prompt" id="fmt-instrucao" spellcheck="false"
              placeholder="Escolha um modelo acima ou escreva o seu prompt. Se ele não trouxer a estrutura do Nexus, ela é adicionada ao final na hora de copiar."></textarea>

            <div class="fmt__acoes">
              <button type="button" class="fmt__btn" data-fmt="copiar" id="fmt-btn-copiar" data-tip="Copia só o prompt (com a estrutura do Nexus), sem o seu texto">${ICONE_COPIAR}Copiar só o prompt</button>
              <button type="button" class="fmt__btn" data-fmt="copiar-estrutura" id="fmt-btn-copiar-estrutura" data-tip="Copia somente a estrutura de saída do Nexus deste prompt, sem o restante e sem o seu texto">${ICONE_COPIAR}Copiar estrutura</button>
              <span class="fmt__status" id="fmt-status" role="status" aria-live="polite"></span>
            </div>
          </section>

          <section class="fmt__bloco" aria-labelledby="fmt-h-texto">
            <h2 class="fmt__h" id="fmt-h-texto">Texto</h2>
            <p class="fmt__dica">Cole aqui o conteúdo estruturado: o objeto com <code>aula</code>, <code>ideia_central</code> e <code>secoes</code>. O Formatador o converte em conteúdo de leitura e o título em Meus conteúdos é o valor de <code>aula</code>.</p>

            <label class="fmt__lbl fmt__lbl--oculto" for="fmt-texto">Texto</label>
            <textarea class="fmt__area fmt__area--texto" id="fmt-texto" spellcheck="false"
              placeholder='{ aula: "Título do conteúdo", ideia_central: "…", secoes: [ { id: "…", titulo: "…", blocos: [ … ] } ] }'></textarea>
            <span class="fmt__count" id="fmt-count">0 palavras · 0 caracteres</span>

            <div class="fmt__acoes">
              <button type="button" class="fmt__btn fmt__btn--forte" data-fmt="formatar" id="fmt-btn-formatar">Formatar texto</button>
              <span class="fmt__status" id="fmt-status-formatar" role="status" aria-live="polite"></span>
            </div>
          </section>
      </div>
     </div>

     <aside class="fmt__lateral" aria-labelledby="fmt-h-lista">
      <div class="fmt__lateral-in">
        <h2 class="fmt__h" id="fmt-h-lista">Meus conteúdos</h2>
        <div class="fmt__barra" id="fmt-barra" hidden>
          <button type="button" class="fmt__btn" data-fmt="juntar-iniciar" id="fmt-btn-juntar" data-tip="Junta dois conteúdos em um novo; os dois originais continuam aqui">${ICONE_JUNTAR}Juntar conteúdos</button>
          <p class="fmt__barra-txt" id="fmt-barra-txt" hidden></p>
          <div class="fmt__acoes" id="fmt-barra-acoes" hidden>
            <button type="button" class="fmt__btn" data-fmt="juntar-cancelar">Cancelar</button>
            <button type="button" class="fmt__btn fmt__btn--forte" data-fmt="juntar-confirmar" id="fmt-btn-juntar-ok" disabled>Juntar</button>
          </div>
          <span class="fmt__status" id="fmt-status-juntar" role="status" aria-live="polite"></span>
        </div>
        <div class="fmt__lista" id="fmt-lista">
          ${htmlVazio()}
        </div>
      </div>
     </aside>
    </div>`;
}

/* ══════════════════════════════════════════════
   3) TOOLTIP
   Qualquer elemento com data-tip="texto" dentro da raiz recebe o tooltip.
     · hover (só em dispositivos com mouse) e foco por teclado
     · fixo em <body>: nunca é cortado por sidebar/containers
     · vira para baixo quando não cabe em cima; nunca sai da tela
     · pointer-events: none (não atrapalha o clique); em toque não aparece
══════════════════════════════════════════════ */
const MOUSE = window.matchMedia ? window.matchMedia('(hover: hover) and (pointer: fine)') : null;
const ATRASO = 320;      // ms até aparecer no hover (foco por teclado: imediato)
const MARGEM = 8;        // distância mínima das bordas da tela
const FOLGA = 8;         // distância entre o tooltip e o elemento

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

    // Calibração: mede onde o tooltip realmente cai (origem e escala reais do fixed),
    // sem transição/transform para a medida ser exata.
    tip.style.transition = 'none'; tip.style.transform = 'none'; tip.style.bottom = 'auto';
    tip.style.left = '0px';   tip.style.top = '0px';
    const o0 = tip.getBoundingClientRect();
    tip.style.left = '100px'; tip.style.top = '100px';
    const o1 = tip.getBoundingClientRect();
    tip.style.transition = ''; tip.style.transform = '';
    const escala = (o1.left - o0.left) / 100 || 1;   // 1 quando não há zoom/transform

    const r = el.getBoundingClientRect();
    const w = o0.width, h = o0.height;               // tamanho na tela
    const vw = document.documentElement.clientWidth;
    const cabeEmCima = r.top - h - FOLGA >= MARGEM;
    const centro = r.left + r.width / 2;
    const left = Math.min(Math.max(centro - w / 2, MARGEM), Math.max(MARGEM, vw - w - MARGEM));
    const top = cabeEmCima ? r.top - h - FOLGA : r.bottom + FOLGA;

    tip.dataset.lado = cabeEmCima ? 'cima' : 'baixo';
    // converte "posição na tela" → valor de left/top que o navegador realmente usa
    tip.style.left = Math.round((left - o0.left) / escala) + 'px';
    tip.style.top  = Math.round((top  - o0.top)  / escala) + 'px';
    tip.style.setProperty('--seta-x', Math.round(Math.min(Math.max(centro - left, 14), w - 14) / escala) + 'px');
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

/* ══════════════════════════════════════════════
   4) CAIXA DE CONFIRMAÇÃO
   Devolve Promise<boolean>. Usa <dialog>.showModal() (foco preso, Esc
   cancela, camada acima de tudo). Foco inicial em "Cancelar": ação
   destrutiva nunca é o padrão.
══════════════════════════════════════════════ */
export function confirmar({
  titulo, texto = '', destaque = '', icone = '',
  rotuloOk = 'Confirmar', rotuloCancelar = 'Cancelar', perigo = false,
}) {
  // Navegador sem <dialog> modal: cai para o confirm nativo (mesmo comportamento de antes).
  if (typeof HTMLDialogElement === 'undefined' || !HTMLDialogElement.prototype.showModal) {
    return Promise.resolve(window.confirm([titulo, destaque, texto].filter(Boolean).join('\n\n')));
  }

  return new Promise(resolve => {
    const d = document.createElement('dialog');
    d.className = 'fmt-dialogo' + (perigo ? ' fmt-dialogo--perigo' : '');
    d.setAttribute('aria-labelledby', 'fmt-dialogo-titulo');
    d.innerHTML = `
      <div class="fmt-dialogo__corpo">
        ${icone ? `<span class="fmt-dialogo__icone">${icone}</span>` : ''}
        <h2 class="fmt-dialogo__titulo" id="fmt-dialogo-titulo">${esc(titulo)}</h2>
        ${destaque ? `<p class="fmt-dialogo__item">${esc(destaque)}</p>` : ''}
        ${texto ? `<p class="fmt-dialogo__texto">${esc(texto)}</p>` : ''}
      </div>
      <div class="fmt-dialogo__acoes">
        <button type="button" class="fmt__btn" data-r="0">${esc(rotuloCancelar)}</button>
        <button type="button" class="fmt__btn ${perigo ? 'fmt__btn--perigo' : 'fmt__btn--forte'}" data-r="1">${esc(rotuloOk)}</button>
      </div>`;
    document.body.appendChild(d);

    let resposta = false;
    d.addEventListener('close', () => { d.remove(); resolve(resposta); });   // Esc também cai aqui (= cancelar)
    d.addEventListener('click', e => {
      const b = e.target.closest('[data-r]');
      if (b) { resposta = b.dataset.r === '1'; d.close(); }
      else if (e.target === d) d.close();                                     // clique no fundo escurecido
    });

    d.showModal();
    d.querySelector('[data-r="0"]').focus();
  });
}