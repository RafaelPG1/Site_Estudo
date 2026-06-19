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
 */

(function () {
  'use strict';

  // Evita duplicata caso o script seja executado mais de uma vez
  if (document.getElementById('nexus-fab')) return;

  function _iconSparkle() {
    return (
      '<svg width="18" height="18" viewBox="0 0 24 24"' +
      ' fill="none" stroke="currentColor"' +
      ' stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"' +
      ' aria-hidden="true">' +
      '<path d="M12 2 L13.5 8.5 L20 10 L13.5 11.5 L12 18 L10.5 11.5 L4 10 L10.5 8.5 Z"/>' +
      '<circle cx="19" cy="5"  r="1.1" fill="#00c8ff" stroke="none"/>' +
      '<circle cx="5"  cy="19" r="0.8" fill="#00c8ff" stroke="none"/>' +
      '</svg>'
    );
  }

  function _criarFAB() {
    var fab = document.createElement('button');
    fab.id   = 'nexus-fab';
    fab.type = 'button';
    fab.setAttribute('aria-label', 'Assistente Nexus — abrir chat');
    fab.setAttribute('aria-expanded', 'false');

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