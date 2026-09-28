/* =============================================
   NEXUS STUDY — resumo/js/formatador/formatador-dialogo.js
   Caixa de confirmação do Formatador (substitui window.confirm).
   Só apresentação: devolve Promise<boolean> e não sabe nada sobre
   o que está sendo confirmado. Usa <dialog>.showModal() do navegador,
   que já entrega foco preso, Esc para cancelar e camada acima de tudo.
   Estilo: .fmt-dialogo em formatador.css.
   O foco inicial fica em "Cancelar" (ação destrutiva nunca é o padrão).
   ============================================= */

import { esc } from '../resumo-utils.js';

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