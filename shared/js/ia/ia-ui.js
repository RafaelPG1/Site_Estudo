/**
 * ASSISTENTE NEXUS — ia-ui.js
 *
 * PATCH scroll-isolado:
 *   O painel #nexus-panel captura wheel e touchmove, impedindo
 *   que o scroll vaze para a página quando o mouse está sobre o modal.
 *
 * PATCH fechar-só-pelo-botão:
 *   Remove o listener de "clicar fora para fechar".
 *   O painel só fecha via FAB (toggle) ou botão X interno.
 */

(function () {
  'use strict';

  let _onSend  = null;
  let _onReset = null;

  /* ══════════════════════════════════════════════════════════
     TEMPLATES HTML
  ══════════════════════════════════════════════════════════ */

  function _iconSparkle(size) {
    size = size || 18;
    return (
      '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24"' +
      ' fill="none" stroke="currentColor"' +
      ' stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"' +
      ' aria-hidden="true">' +
      '<path d="M12 2 L13.5 8.5 L20 10 L13.5 11.5 L12 18 L10.5 11.5 L4 10 L10.5 8.5 Z"/>' +
      '<circle cx="19" cy="5"  r="1.1" fill="#00c8ff" stroke="none"/>' +
      '<circle cx="5"  cy="19" r="0.8" fill="#00c8ff" stroke="none"/>' +
      '</svg>'
    );
  }

  function _iconClose() {
    return (
      '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
      ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<line x1="18" y1="6" x2="6" y2="18"/>' +
      '<line x1="6"  y1="6" x2="18" y2="18"/>' +
      '</svg>'
    );
  }

  function _iconReset() {
    return (
      '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
      ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<polyline points="1 4 1 10 7 10"/>' +
      '<path d="M3.51 15a9 9 0 1 0 .49-4.5"/>' +
      '</svg>'
    );
  }

  function _iconSend() {
    return (
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
      ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<line x1="22" y1="2" x2="11" y2="13"/>' +
      '<polygon points="22 2 15 22 11 13 2 9 22 2"/>' +
      '</svg>'
    );
  }

  function _iconHeaderIA() {
    return (
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00c8ff"' +
      ' stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M12 2 L13.5 8.5 L20 10 L13.5 11.5 L12 18 L10.5 11.5 L4 10 L10.5 8.5 Z"/>' +
      '<circle cx="19" cy="5"  r="1.1" fill="#00c8ff" stroke="none"/>' +
      '<circle cx="5"  cy="19" r="0.8" fill="#00c8ff" stroke="none"/>' +
      '</svg>'
    );
  }

  function _iconBot() {
    return (
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
      ' stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<line x1="12" y1="2" x2="12" y2="5"/>' +
      '<circle cx="12" cy="2" r="1" fill="currentColor" stroke="none"/>' +
      '<rect x="3" y="5" width="18" height="13" rx="3" ry="3"/>' +
      '<circle cx="9"  cy="11" r="1.5" fill="currentColor" stroke="none"/>' +
      '<circle cx="15" cy="11" r="1.5" fill="currentColor" stroke="none"/>' +
      '<path d="M9 15 Q12 17 15 15"/>' +
      '<line x1="3"  y1="10" x2="1"  y2="10"/>' +
      '<line x1="21" y1="10" x2="23" y2="10"/>' +
      '</svg>'
    );
  }

  function _iconUser() {
    return (
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
      ' stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<circle cx="12" cy="8" r="4"/>' +
      '<path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>' +
      '</svg>'
    );
  }

  /* ══════════════════════════════════════════════════════════
     CRIAÇÃO DOS ELEMENTOS NO DOM
  ══════════════════════════════════════════════════════════ */

  function _criarFAB() {
    var fab = document.createElement('button');
    fab.id   = 'nexus-fab';
    fab.type = 'button';
    fab.setAttribute('aria-label', 'Assistente Nexus — abrir chat');
    fab.setAttribute('aria-expanded', 'false');

    fab.innerHTML =
      '<div id="nexus-fab-body">' +
        '<div id="nexus-fab-icon-wrap">' +
          '<span id="nexus-fab-icon">' + _iconSparkle(18) + '</span>' +
        '</div>' +
      '</div>' +
      '<div id="nexus-fab-ripple" aria-hidden="true"></div>' +
      '<span class="nexus-fab-label" aria-hidden="true">nexus ia</span>';

    return fab;
  }

  function _criarPainel() {
    var panel = document.createElement('div');
    panel.id            = 'nexus-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-label', 'Assistente Nexus');

    panel.innerHTML =
      '<div id="nexus-header">' +
        '<div id="nexus-header-icon">' + _iconHeaderIA() + '</div>' +
        '<div id="nexus-header-info">' +
          '<div id="nexus-title">Nexus IA</div>' +
          '<div id="nexus-subtitle">' +
            '<span class="nexus-status-dot nexus-dev" aria-hidden="true"></span>' +
            'assistente de estudos' +
          '</div>' +
        '</div>' +
        '<button id="nexus-reset" type="button" aria-label="Reiniciar conversa">' +
          _iconReset() +
        '</button>' +
        '<button id="nexus-close" type="button" aria-label="Fechar assistente">' +
          _iconClose() +
        '</button>' +
      '</div>' +

      '<div id="nexus-disc-bar">' +
        '<span id="nexus-disc-label">nenhuma disciplina selecionada</span>' +
      '</div>' +

      '<div id="nexus-messages" role="log" aria-live="polite" aria-atomic="false"></div>' +

      '<div id="nexus-typing" aria-label="Nexus está digitando" aria-live="polite">' +
        '<div class="nexus-msg-avatar" aria-hidden="true">' + _iconBot() + '</div>' +
        '<div class="nexus-typing-dots">' +
          '<span></span><span></span><span></span>' +
        '</div>' +
      '</div>' +

      '<div id="nexus-footer">' +
        '<div id="nexus-input-row">' +
          '<textarea' +
          ' id="nexus-input"' +
          ' rows="1"' +
          ' placeholder="Digite sua mensagem…"' +
          ' aria-label="Mensagem para o assistente"' +
          ' autocomplete="off"' +
          ' spellcheck="false"' +
          '></textarea>' +
          '<button id="nexus-send" type="button" aria-label="Enviar mensagem">' +
            _iconSend() +
          '</button>' +
        '</div>' +
        '<div id="nexus-hint">Enter para enviar  ·  Shift+Enter para nova linha</div>' +
      '</div>';

    return panel;
  }

  /* ══════════════════════════════════════════════════════════
     RENDERIZAÇÃO DE MENSAGENS
  ══════════════════════════════════════════════════════════ */

  function _escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function _formatarTexto(texto) {
    var escaped = _escapeHtml(texto);
    escaped = escaped
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g,     '<em>$1</em>')
      .replace(/`(.+?)`/g,       '<code style="font-family:\'JetBrains Mono\',monospace;font-size:11px;background:rgba(0,200,255,0.08);padding:1px 4px;border-radius:3px;">$1</code>');
    escaped = escaped.replace(/\n/g, '<br>');
    return escaped;
  }

  function _renderRodape(rodape) {
    if (!rodape) return '';
    return (
      '<div class="nexus-rodape-ia">' +
        (rodape.linha1 ? '<span class="nexus-rodape-ia-linha1">' + _escapeHtml(rodape.linha1) + '</span>' : '') +
        (rodape.linha2 ? '<span class="nexus-rodape-ia-linha2">' + _escapeHtml(rodape.linha2) + '</span>' : '') +
      '</div>'
    );
  }

  function renderMessage(msg) {
    var container = document.getElementById('nexus-messages');
    if (!container) return;

    var el = document.createElement('div');

    if (msg.role === 'user') {
      el.className = 'nexus-msg nexus-user';
      el.innerHTML =
        '<div class="nexus-msg-avatar" aria-hidden="true">' + _iconUser() + '</div>' +
        '<div class="nexus-msg-wrap">' +
          '<div class="nexus-msg-bubble">' + _formatarTexto(msg.text) + '</div>' +
          (msg.time ? '<div class="nexus-msg-time">' + _escapeHtml(msg.time) + '</div>' : '') +
        '</div>';

    } else if (msg.role === 'bot') {
      el.className = 'nexus-msg nexus-bot';
      el.innerHTML =
        '<div class="nexus-msg-avatar" aria-hidden="true">' + _iconBot() + '</div>' +
        '<div class="nexus-msg-wrap">' +
          '<div class="nexus-msg-bubble">' +
            _formatarTexto(msg.text) +
            _renderRodape(msg.rodape) +
          '</div>' +
          (msg.time ? '<div class="nexus-msg-time">' + _escapeHtml(msg.time) + '</div>' : '') +
        '</div>';

    } else {
      el.className = 'nexus-msg nexus-system';
      el.innerHTML =
        '<div class="nexus-msg-bubble">' + _formatarTexto(msg.text) + '</div>';
    }

    container.appendChild(el);
    _scrollToBottom(container);
  }

  function _scrollToBottom(container) {
    requestAnimationFrame(function () {
      container.scrollTop = container.scrollHeight;
    });
  }

  /* ══════════════════════════════════════════════════════════
     TYPING INDICATOR
  ══════════════════════════════════════════════════════════ */

  function showTyping() {
    var el = document.getElementById('nexus-typing');
    var container = document.getElementById('nexus-messages');
    if (!el) return;
    el.classList.add('nexus-visible');
    if (container) {
      container.appendChild(el);
      _scrollToBottom(container);
    }
  }

  function hideTyping() {
    var el = document.getElementById('nexus-typing');
    if (!el) return;
    el.classList.remove('nexus-visible');
  }

  /* ══════════════════════════════════════════════════════════
     CHIPS DE SUGESTÃO
  ══════════════════════════════════════════════════════════ */

  function mostrarSugestoes(chips, onClick) {
    var container = document.getElementById('nexus-messages');
    if (!container) return;
    var anterior = container.querySelector('.nexus-sugestoes');
    if (anterior) anterior.remove();

    if (!chips || !chips.length) return;

    var wrap = document.createElement('div');
    wrap.className = 'nexus-sugestoes';

    chips.forEach(function (chip) {
      var btn = document.createElement('button');
      btn.type = 'button';

      var classes = ['nexus-sugestao-chip'];
      if (chip.tipo === 'disc')     classes.push('nexus-sugestao-chip--disc');
      if (chip.tipo === 'disc-cmd') classes.push('nexus-sugestao-chip--disc', 'nexus-sugestao-chip--disc-cmd');
      btn.className = classes.join(' ');

      btn.textContent = chip.label;
      btn.setAttribute('aria-label', 'Sugestão: ' + chip.label);

      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        wrap.remove();
        if (typeof onClick === 'function') onClick(chip.cmd || chip.label);
      });

      wrap.appendChild(btn);
    });

    container.appendChild(wrap);
    _scrollToBottom(container);
  }

  /* ══════════════════════════════════════════════════════════
     BARRA DE DISCIPLINA ATIVA
  ══════════════════════════════════════════════════════════ */

  function atualizarDiscAtiva(apelido) {
    var bar   = document.getElementById('nexus-disc-bar');
    var label = document.getElementById('nexus-disc-label');
    if (!bar || !label) return;

    if (apelido) {
      label.textContent = apelido;
      bar.classList.add('nexus-disc-ativa');
    } else {
      label.textContent = 'nenhuma disciplina selecionada';
      bar.classList.remove('nexus-disc-ativa');
    }
  }

  /* ══════════════════════════════════════════════════════════
     CONTROLE DO PAINEL (abrir / fechar / toggle)
  ══════════════════════════════════════════════════════════ */

  function _setPainelAberto(aberto) {
    var fab   = document.getElementById('nexus-fab');
    var panel = document.getElementById('nexus-panel');
    if (!fab || !panel) return;

    if (aberto) {
      panel.classList.add('nexus-open');
      fab.classList.add('nexus-active');
      fab.setAttribute('aria-expanded', 'true');

      var input = document.getElementById('nexus-input');
      if (input) setTimeout(function () { input.focus(); }, 260);

    } else {
      panel.classList.remove('nexus-open');
      fab.classList.remove('nexus-active');
      fab.setAttribute('aria-expanded', 'false');
    }
  }

  function open()   { _setPainelAberto(true);  }
  function close()  { _setPainelAberto(false); }
  function toggle() {
    var panel = document.getElementById('nexus-panel');
    if (!panel) return;
    _setPainelAberto(!panel.classList.contains('nexus-open'));
  }

  /* ══════════════════════════════════════════════════════════
     PATCH scroll-isolado
     Captura wheel e touchmove no painel para impedir que o
     scroll vaze para a página quando o mouse está sobre o modal.
  ══════════════════════════════════════════════════════════ */
  function _bindScrollIsolado(panel) {
    // wheel — desktop
    panel.addEventListener('wheel', function (e) {
      var messages = document.getElementById('nexus-messages');
      if (!messages) return;

      var atTop    = messages.scrollTop === 0;
      var atBottom = messages.scrollTop + messages.clientHeight >= messages.scrollHeight - 1;

      // Bloqueia só se o scroll interno não tiver mais para onde ir nessa direção
      var scrollingUp   = e.deltaY < 0;
      var scrollingDown = e.deltaY > 0;

      if ((scrollingUp && atTop) || (scrollingDown && atBottom)) {
        e.preventDefault();
      }

      // Em todos os outros casos deixa o #nexus-messages scrollar normalmente
      // mas para a propagação para a página
      e.stopPropagation();
    }, { passive: false });

    // touchmove — mobile
    var _touchStartY = 0;
    panel.addEventListener('touchstart', function (e) {
      _touchStartY = e.touches[0].clientY;
    }, { passive: true });

    panel.addEventListener('touchmove', function (e) {
      var messages = document.getElementById('nexus-messages');
      if (!messages) return;

      var deltaY    = _touchStartY - e.touches[0].clientY;
      var atTop     = messages.scrollTop === 0;
      var atBottom  = messages.scrollTop + messages.clientHeight >= messages.scrollHeight - 1;

      if ((deltaY < 0 && atTop) || (deltaY > 0 && atBottom)) {
        e.preventDefault();
      }
      e.stopPropagation();
    }, { passive: false });
  }

  /* ══════════════════════════════════════════════════════════
     EVENTOS DO INPUT
  ══════════════════════════════════════════════════════════ */

  function _bindInput() {
    var input   = document.getElementById('nexus-input');
    var sendBtn = document.getElementById('nexus-send');
    if (!input || !sendBtn) return;

    input.addEventListener('input', function () {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        _enviar();
      }
    });

    sendBtn.addEventListener('click', _enviar);
  }

  function _enviar() {
    var input = document.getElementById('nexus-input');
    if (!input) return;
    var texto = input.value.trim();
    if (!texto) return;
    input.value = '';
    input.style.height = 'auto';
    input.classList.remove('nexus-input--cmd');
    if (typeof _onSend === 'function') _onSend(texto);
  }

  /* ══════════════════════════════════════════════════════════
     EVENTO DO BOTÃO RESET
  ══════════════════════════════════════════════════════════ */

  function _bindReset() {
    var btn = document.getElementById('nexus-reset');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (typeof _onReset === 'function') _onReset();
    });
  }

  /* ══════════════════════════════════════════════════════════
     INICIALIZAÇÃO PÚBLICA — NexusUI.init()
     PATCH fechar-só-pelo-botão: _bindClickFora() removido.
     O painel só fecha via FAB (toggle) ou botão #nexus-close.
  ══════════════════════════════════════════════════════════ */

  function init(opts) {
    opts     = opts    || {};
    _onSend  = opts.onSend  || null;
    _onReset = opts.onReset || null;

    if (document.getElementById('nexus-fab')) return;

    var fab   = _criarFAB();
    var panel = _criarPainel();
    document.body.appendChild(fab);
    document.body.appendChild(panel);

    // FAB abre/fecha (toggle)
    fab.addEventListener('click', toggle);

    // Botão X fecha
    document.getElementById('nexus-close').addEventListener('click', close);

    _bindInput();
    _bindReset();
    _bindScrollIsolado(panel);   // PATCH scroll-isolado
    // _bindClickFora() — REMOVIDO (PATCH fechar-só-pelo-botão)
  }

  /* ══════════════════════════════════════════════════════════
     API PÚBLICA
  ══════════════════════════════════════════════════════════ */

  window.NexusUI = {
    init:               init,
    open:               open,
    close:              close,
    toggle:             toggle,
    renderMessage:      renderMessage,
    showTyping:         showTyping,
    hideTyping:         hideTyping,
    mostrarSugestoes:   mostrarSugestoes,
    atualizarDiscAtiva: atualizarDiscAtiva,
  };

}());