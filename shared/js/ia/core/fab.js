/**
 * NEXUS — shared/js/ia/core/fab.js
 *
 * Responsabilidade ÚNICA: criar o elemento #nexus-fab no DOM antecipadamente,
 * para que o botão apareça junto com os demais elementos da interface.
 *
 * NÃO registra nenhum evento de clique, toggle, open ou close.
 * Toda a lógica funcional continua pertencendo a ui.js → NexusUI.init().
 *
 * Contrato com ui.js:
 *   • ui.js faz: document.getElementById('nexus-fab') || _criarFAB()
 *     → encontra o botão já existente e o reutiliza.
 *   • ui.js verifica: !fab.dataset.nexusBound
 *     → como fab.js nunca define essa flag, ui.js SEMPRE registra o listener.
 *   • fab.js nunca define nexusBound nem adiciona qualquer addEventListener.
 *
 * ── AJUSTE (suporte ao shake nativo da IA) ────────────────────
 *   O ícone interno passou de stroke-based para fill-based, igual
 *   ao _iconSparkle() de ui.js — antes os dois pontos de criação do
 *   FAB (fab.js e ui.js) geravam ícones visualmente diferentes
 *   dependendo de qual rodasse primeiro. Sem relação direta com a
 *   animação de shake em si (que atua sobre #nexus-fab, não sobre o
 *   ícone), mas corrigido aqui para que o botão fique idêntico nos
 *   dois fluxos de inicialização antes de qualquer animação rodar.
 *
 *   Também adicionado will-change: transform no elemento raiz —
 *   o shake (.nexus-fab--shake, definido em ia.css) anima translateX
 *   + rotate; sem o hint de will-change, o navegador só descobre que
 *   precisa de uma camada de composição própria no primeiro disparo,
 *   o que pode causar um micro-engasgo (jank) bem no primeiro shake.
 *   Com o hint presente desde a criação do botão, a camada já existe
 *   antes do primeiro clique bloqueado.
 */

(function () {
  'use strict';

  // Evita duplicata caso o script seja executado mais de uma vez
  if (document.getElementById('nexus-fab')) return;

  function _iconSparkle() {
    return (
      '<svg width="19" height="19" viewBox="0 0 24 24"' +
      ' fill="none" aria-hidden="true">' +
      '<path d="M12 2' +
        ' C12 6.5 13 9.5 15 11.5' +
        ' C17 13.5 20 14.5 22 14.5' +
        ' C20 14.5 17 15.5 15 17.5' +
        ' C13 19.5 12 22.5 12 27' +
        ' C12 22.5 11 19.5 9 17.5' +
        ' C7 15.5 4 14.5 2 14.5' +
        ' C4 14.5 7 13.5 9 11.5' +
        ' C11 9.5 12 6.5 12 2 Z"' +
        ' transform="translate(0,-2.5) scale(0.86)"' +
        ' fill="currentColor"/>' +
      '<circle cx="18.5" cy="5.5" r="1.2" fill="#00c8ff"/>' +
      '</svg>'
    );
  }

  function _criarFAB() {
    var fab = document.createElement('button');
    fab.id   = 'nexus-fab';
    fab.type = 'button';
    fab.setAttribute('aria-label', 'Assistente Nexus — abrir chat');
    fab.setAttribute('aria-expanded', 'false');

    // will-change prepara a camada de composição com antecedência,
    // para que o shake (translateX + rotate, ver ia.css) não tenha
    // um primeiro disparo com jank por falta de camada própria.
    fab.style.willChange = 'transform';

    // HTML idêntico ao _criarFAB() de ui.js — nenhum desvio estrutural
    fab.innerHTML =
      '<div id="nexus-fab-body">' +
        '<div id="nexus-fab-icon-wrap">' +
          '<span id="nexus-fab-icon">' + _iconSparkle() + '</span>' +
        '</div>' +
      '</div>' +
      '<div id="nexus-fab-ripple" aria-hidden="true"></div>' +
      '<span class="nexus-fab-label" aria-hidden="true">nexus ia</span>';

    return fab;
  }

  function _injetar() {
    // Checa novamente dentro do callback — ui.js pode ter rodado primeiro
    if (document.getElementById('nexus-fab')) return;
    document.body.appendChild(_criarFAB());
  }

  // Se o <body> já existe (script no <head> após os CSS), injeta de forma síncrona.
  // Caso contrário, aguarda o parser criar o <body>.
  if (document.body) {
    _injetar();
  } else {
    document.addEventListener('DOMContentLoaded', _injetar, { once: true });
  }

}());