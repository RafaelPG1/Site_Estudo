/**
 * ASSISTENTE NEXUS — ia-ui.js
 * Camada de interface pura.
 *
 * Responsabilidades:
 *   - Construir e injetar o DOM (FAB + painel)
 *   - Renderizar mensagens (user / bot / system)
 *   - Controlar typing indicator e scroll
 *   - Abrir / fechar / alternar o painel
 *
 * NÃO faz:
 *   - Busca de conteúdo
 *   - Lógica de negócio
 *   - Chamadas a APIs externas
 *
 * API pública:  window.NexusUI
 */

(function () {
  'use strict';

  /* ── ÍCONES SVG ────────────────────────────────────────────── */
  const SVG = {
    bot: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M12 2v4M8 11V8a4 4 0 0 1 8 0v3"/>
            <circle cx="9" cy="16" r="1" fill="currentColor" stroke="none"/>
            <circle cx="15" cy="16" r="1" fill="currentColor" stroke="none"/>
          </svg>`,
    user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
             <circle cx="12" cy="8" r="4"/>
             <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
           </svg>`,
    send: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <line x1="22" y1="2" x2="11" y2="13"/>
             <polygon points="22 2 15 22 11 13 2 9 22 2"/>
           </svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>`,
    header: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
               <path d="M12 2L2 7l10 5 10-5-10-5z"/>
               <path d="M2 17l10 5 10-5"/>
               <path d="M2 12l10 5 10-5"/>
             </svg>`,
    fab: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            <circle cx="9" cy="10" r="0.8" fill="currentColor" stroke="none"/>
            <circle cx="12" cy="10" r="0.8" fill="currentColor" stroke="none"/>
            <circle cx="15" cy="10" r="0.8" fill="currentColor" stroke="none"/>
          </svg>`,
  };

  /* ── HELPERS ─────────────────────────────────────────────── */
  function _sanitize(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function _getTime() {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  function _scrollToBottom() {
    const msgs = document.getElementById('nexus-messages');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }

  /* ── CONSTRUÇÃO DO DOM ───────────────────────────────────── */
  function _buildUI() {
    // Botão flutuante
    const fab = document.createElement('button');
    fab.id = 'nexus-fab';
    fab.setAttribute('aria-label', 'Abrir Assistente Nexus');
    fab.setAttribute('title', 'Assistente Nexus');
    fab.innerHTML = `<span id="nexus-fab-icon">${SVG.fab}</span>`;

    // Painel
    const panel = document.createElement('div');
    panel.id = 'nexus-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Assistente Nexus');
    panel.setAttribute('aria-modal', 'true');
    panel.innerHTML = `
      <div id="nexus-header">
        <div id="nexus-header-icon">${SVG.header}</div>
        <div id="nexus-header-info">
          <div id="nexus-title">Assistente Nexus</div>
          <div id="nexus-subtitle">
            <span class="nexus-status-dot nexus-dev"></span>
            <span>v1.0 · em desenvolvimento</span>
          </div>
        </div>
        <button id="nexus-close" aria-label="Fechar chat">${SVG.close}</button>
      </div>

      <div id="nexus-messages" role="log" aria-live="polite"></div>

      <div id="nexus-typing" aria-hidden="true">
        <div class="nexus-msg-avatar">${SVG.bot}</div>
        <div class="nexus-typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>

      <div id="nexus-footer">
        <div id="nexus-input-row">
          <textarea
            id="nexus-input"
            rows="1"
            placeholder="Digite sua mensagem…"
            aria-label="Mensagem para o Assistente Nexus"
            maxlength="1000"
          ></textarea>
          <button id="nexus-send" aria-label="Enviar mensagem">${SVG.send}</button>
        </div>
        <div id="nexus-hint">Enter para enviar · Shift+Enter para nova linha</div>
      </div>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(panel);
  }

  /* ── RENDERIZAÇÃO DE MENSAGENS ───────────────────────────── */

  /**
   * Renderiza uma mensagem no painel.
   * @param {{ role: 'user'|'bot'|'system', text: string, time?: string }} msg
   */
function renderMessage(msg) {
  const msgs = document.getElementById('nexus-messages');
  if (!msgs) return;

  const time = msg.time || _getTime();

  if (msg.role === 'system') {
    const el = document.createElement('div');
    el.className = 'nexus-msg nexus-system';
    el.innerHTML = `<div class="nexus-msg-bubble">${_sanitize(msg.text)}</div>`;
    msgs.appendChild(el);
    _scrollToBottom();
    return;
  }

  const isUser = msg.role === 'user';
  const wrapper = document.createElement('div');
  wrapper.className = `nexus-msg ${isUser ? 'nexus-user' : 'nexus-bot'}`;

  if (isUser) {
    wrapper.innerHTML = `
      <div>
        <div class="nexus-msg-bubble">${_sanitize(msg.text)}</div>
        <div class="nexus-msg-time">${time}</div>
      </div>
      <div class="nexus-msg-avatar">${SVG.user}</div>
    `;
  } else {
    wrapper.innerHTML = `
      <div class="nexus-msg-avatar">${SVG.bot}</div>
      <div>
        <div class="nexus-msg-bubble">${_sanitize(msg.text)}</div>
        <div class="nexus-msg-time">${time}</div>
      </div>
    `;
  }

  msgs.appendChild(wrapper);
  _scrollToBottom();
}

  /* ── TYPING INDICATOR ────────────────────────────────────── */
  function showTyping() {
    const el   = document.getElementById('nexus-typing');
    const msgs = document.getElementById('nexus-messages');
    if (!el || !msgs) return;
    msgs.appendChild(el);
    el.classList.add('nexus-visible');
    _scrollToBottom();
  }

  function hideTyping() {
    const el = document.getElementById('nexus-typing');
    if (el) el.classList.remove('nexus-visible');
  }

  /* ── ABRIR / FECHAR / ALTERNAR ───────────────────────────── */
  let _isOpen = false;

  function open() {
    if (_isOpen) return;
    _isOpen = true;
    const panel = document.getElementById('nexus-panel');
    const fab   = document.getElementById('nexus-fab');
    if (!panel || !fab) return;
    panel.classList.add('nexus-open');
    fab.classList.add('nexus-active');
    fab.setAttribute('aria-label', 'Fechar Assistente Nexus');
    setTimeout(() => {
      const input = document.getElementById('nexus-input');
      if (input) input.focus();
    }, 280);
  }

  function close() {
    if (!_isOpen) return;
    _isOpen = false;
    const panel = document.getElementById('nexus-panel');
    const fab   = document.getElementById('nexus-fab');
    if (!panel || !fab) return;
    panel.classList.remove('nexus-open');
    fab.classList.remove('nexus-active');
    fab.setAttribute('aria-label', 'Abrir Assistente Nexus');
  }

  function toggle() {
    _isOpen ? close() : open();
  }

  function isOpen() {
    return _isOpen;
  }

  /* ── AUTO-RESIZE TEXTAREA ────────────────────────────────── */
  function _autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
  }

  /* ── INICIALIZAÇÃO ───────────────────────────────────────── */

  /**
   * Monta o DOM e vincula os eventos de UI.
   * O callback onSend(text) é chamado pelo controlador (ia.js)
   * quando o usuário submete uma mensagem.
   * @param {{ onSend: (text: string) => void, onClose?: () => void }} callbacks
   */
  function init(callbacks) {
    if (document.getElementById('nexus-fab')) return; // já inicializado

    _buildUI();

    const fab   = document.getElementById('nexus-fab');
    const closeBtn = document.getElementById('nexus-close');
    const sendBtn  = document.getElementById('nexus-send');
    const input    = document.getElementById('nexus-input');

    if (fab)      fab.addEventListener('click', toggle);
    if (closeBtn) closeBtn.addEventListener('click', close);

    if (sendBtn) {
      sendBtn.addEventListener('click', () => _submitInput(input, callbacks.onSend));
    }

    if (input) {
      input.addEventListener('input', function () { _autoResize(this); });
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          _submitInput(this, callbacks.onSend);
        }
      });
    }

    // Fecha com Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && _isOpen) close();
    });

    // Clique fora fecha (apenas desktop)
    document.addEventListener('click', function (e) {
      if (!_isOpen) return;
      const panel = document.getElementById('nexus-panel');
      const fab_  = document.getElementById('nexus-fab');
      if (panel && fab_ && !panel.contains(e.target) && !fab_.contains(e.target)) {
        close();
      }
    });
  }

  function _submitInput(input, onSend) {
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    input.style.height = 'auto';
    input.focus();
    if (typeof onSend === 'function') onSend(text);
  }

  /* ── API PÚBLICA ─────────────────────────────────────────── */
  window.NexusUI = {
    init,
    open,
    close,
    toggle,
    isOpen,
    renderMessage,
    showTyping,
    hideTyping,
  };

}());