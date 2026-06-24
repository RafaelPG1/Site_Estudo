/**
 * NEXUS — shared/js/ia/core/ui.js
 *
 * Responsabilidade exclusiva: renderização do painel de chat.
 * NÃO conhece resumo, quiz, disciplinas ou lógica de domínio.
 *
 * ── MUDANÇAS v-árvore-de-conversa ───────────────────────────
 *   _renderVersionSwitch passou a entender DOIS formatos de
 *   versionamento de uma mensagem de usuário:
 *
 *     1. msg.tree  (novo formato — árvore de conversa)
 *        { nodes, rootId, activeId }. O "rootId" é um nó sentinela
 *        interno (nunca exibido); o total de versões e a posição
 *        atual são calculados a partir dos filhos do sentinela.
 *
 *     2. msg.versions[] (formato legado, lista linear)
 *        ainda suportado para o instante entre "histórico acabou
 *        de ser restaurado do localStorage" e "o assistant de
 *        domínio normalizou a mensagem para msg.tree na primeira
 *        interação" — a normalização em si é responsabilidade do
 *        assistant (_garantirTree), não desta camada de UI.
 *
 *   Em ambos os casos a UI continua exibindo apenas "< i/N >" e
 *   delegando a troca de versão via onVersionSwitch(msgIndex, delta).
 *
 * ── AUTH GUARD ────────────────────────────────────────────────
 *   O painel de IA exige autenticação. Visitantes têm o FAB
 *   bloqueado visualmente (cinza) e recebem um shake ao clicar.
 *   Usuários autenticados têm acesso total.
 *
 *   O guard reage em tempo real a nexus:loginSuccess e nexus:logout
 *   sem necessidade de reload.
 *
 *   Integração: usa exclusivamente estaLogado() de global.js.
 *
 * ── PIN / FECHAR FORA / ESC ───────────────────────────────────
 *   • Clicar fora do painel fecha (se não estiver fixado).
 *   • ESC fecha (se não estiver fixado).
 *   • Botão pin no header alterna o modo fixado.
 *   • Estado do pin persiste via sessionStorage.
 *
 * API pública: window.NexusUI
 */

(function () {
  'use strict';

  let _onSend          = null;
  let _onReset         = null;
  let _onEdit          = null;
  let _playSound       = null;
  let _onVersionSwitch = null;

  /* ── Referência ao módulo global de autenticação ─────────────
     Carregada de forma lazy para evitar dependência circular.
     estaLogado() retorna boolean; se o módulo não carregar (páginas
     sem autenticação), o guard assume "logado" para não bloquear. */
  var _estaLogado = null;

  (function _carregarPlaySound() {
    var script = document.currentScript ||
      (function () {
        var scripts = document.querySelectorAll('script[src*="ui.js"]');
        for (var i = scripts.length - 1; i >= 0; i--) {
          if (scripts[i].src.includes('/ia/core/ui.js')) return scripts[i];
        }
        return scripts[scripts.length - 1];
      }());

    if (!script) return;

    var base = new URL(script.src);

    /* Carrega playSound */
    var partesAudio = base.pathname.split('/');
    partesAudio.splice(partesAudio.length - 3, 3, 'audio', 'audio-api.js');
    var audioUrl = base.origin + partesAudio.join('/');

    import(audioUrl)
      .then(function (mod) { _playSound = mod.playSound || null; })
      .catch(function (err) { console.warn('[NexusUI] playSound não carregado:', err); });

    /* Carrega estaLogado de global.js */
    var partesGlobal = base.pathname.split('/');
    partesGlobal.splice(partesGlobal.length - 5, 5, 'src', 'global.js');
    var globalUrl = base.origin + partesGlobal.join('/');

    import(globalUrl)
      .then(function (mod) {
        _estaLogado = mod.estaLogado || null;
        _guardCarregado = true;
        _guardVerificar();
      })
      .catch(function (err) {
        _guardCarregado = true;  /* em erro, desbloqueia */
        console.warn('[NexusUI] global.js não carregado — guard desativado:', err);
      });
  }());

  /* ══════════════════════════════════════════════════════════
     AUTH GUARD
     ────────────────────────────────────────────────────────
     Bloqueia o FAB quando o usuário não está autenticado.

     Fluxo:
       • _guardVerificar()  → chamado no init e nos eventos de auth.
       • _guardBloquear()   → adiciona .nexus-fab--locked.
       • _guardLiberar()    → remove .nexus-fab--locked.
       • nexus:loginSuccess → libera o guard.
       • nexus:logout       → bloqueia o guard.
  ══════════════════════════════════════════════════════════ */

  var _guardAtivo     = false;  /* true enquanto o FAB estiver bloqueado */
  var _guardBound     = false;  /* listeners de auth registrados apenas uma vez */
  var _guardCarregado = false;  /* true após global.js confirmar o status */

  function _verificadoLogado() {
    if (typeof _estaLogado === 'function') return _estaLogado();
    return true;
  }

  function _guardBloquear() {
    if (_guardAtivo) return;
    _guardAtivo = true;

    var fab = document.getElementById('nexus-fab');
    if (fab) fab.classList.add('nexus-fab--locked');
  }

  function _guardLiberar() {
    if (!_guardAtivo) return;
    _guardAtivo = false;

    var fab = document.getElementById('nexus-fab');
    if (fab) fab.classList.remove('nexus-fab--locked');
  }

  function _guardVerificar() {
    if (_verificadoLogado()) {
      _guardLiberar();
    } else {
      _guardBloquear();
    }
  }

  function _guardBindEventos() {
    if (_guardBound) return;
    _guardBound = true;

    document.addEventListener('nexus:loginSuccess', function () {
      _guardLiberar();
    });

    document.addEventListener('nexus:logout', function () {
      _guardBloquear();
    });
  }

  /* ══════════════════════════════════════════════════════════
     TEMPLATES HTML — ÍCONES
  ══════════════════════════════════════════════════════════ */

  function _iconFab() {
    return (
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
        '<defs>' +
          '<radialGradient id="nxFabGrad" cx="44%" cy="36%" r="62%">' +
            '<stop offset="0%"   stop-color="#dff8ff"/>' +
            '<stop offset="28%"  stop-color="#5ee4ff"/>' +
            '<stop offset="65%"  stop-color="#00b8f0"/>' +
            '<stop offset="100%" stop-color="#005f90"/>' +
          '</radialGradient>' +
          '<radialGradient id="nxFabHalo" cx="50%" cy="50%" r="50%">' +
            '<stop offset="0%"   stop-color="#00c8ff" stop-opacity="0.18"/>' +
            '<stop offset="100%" stop-color="#00c8ff" stop-opacity="0"/>' +
          '</radialGradient>' +
          '<radialGradient id="nxDotHalo" cx="50%" cy="50%" r="50%">' +
            '<stop offset="0%"   stop-color="#7cf0ff" stop-opacity="0.5"/>' +
            '<stop offset="100%" stop-color="#00c8ff" stop-opacity="0"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<circle cx="11.5" cy="13" r="5.5" fill="url(#nxFabHalo)"/>' +
        '<path' +
          ' d="M11.8 2.8' +
          ' C11.8 6.1 12.7 8.3 14.4 10.0' +
          ' C16.2 11.8 18.5 12.6 21.0 12.6' +
          ' C18.5 12.6 16.2 13.5 14.4 15.3' +
          ' C12.7 17.0 11.8 19.4 11.8 22.6' +
          ' C11.8 19.4 10.9 17.0 9.1 15.3' +
          ' C7.4 13.5 5.0 12.6 2.5 12.6' +
          ' C5.0 12.6 7.4 11.8 9.1 10.0' +
          ' C10.9 8.3 11.8 6.1 11.8 2.8 Z"' +
          ' fill="url(#nxFabGrad)"/>' +
        '<path' +
          ' d="M11.8 4.5 C11.8 6.5 12.4 8.0 13.6 9.2 C12.4 8.0 11.8 6.5 11.8 4.5 Z"' +
          ' fill="white" opacity="0.22"/>' +
        '<circle cx="19.2" cy="5.8" r="2.4" fill="url(#nxDotHalo)"/>' +
        '<circle cx="19.2" cy="5.8" r="1.3" fill="#00c8ff" opacity="0.75"/>' +
        '<circle cx="19.2" cy="5.8" r="0.65" fill="#e8fbff"/>' +
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

  function _iconCopy() {
    return (
      '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
      ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>' +
      '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>' +
      '</svg>'
    );
  }

  function _iconCheck() {
    return (
      '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
      ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<polyline points="20 6 9 17 4 12"/>' +
      '</svg>'
    );
  }

  function _iconEdit() {
    return (
      '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
      ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>' +
      '</svg>'
    );
  }

  function _iconMove() {
    return (
      '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"' +
      ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<polyline points="5 9 2 12 5 15"/>' +
      '<polyline points="9 5 12 2 15 5"/>' +
      '<polyline points="15 19 12 22 9 19"/>' +
      '<polyline points="19 9 22 12 19 15"/>' +
      '<line x1="2" y1="12" x2="22" y2="12"/>' +
      '<line x1="12" y1="2" x2="12" y2="22"/>' +
      '</svg>'
    );
  }

function _iconPin() {
  return (
    '<svg width="12" height="12" viewBox="0 0 256 256" fill="none" aria-hidden="true">' +
    '<rect width="256" height="256" fill="none"/>' +
    '<line x1="128" y1="176" x2="128" y2="240" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="22"/>' +
    '<line x1="64" y1="40" x2="192" y2="40" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="22"/>' +
    '<line x1="40" y1="176" x2="216" y2="176" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="22"/>' +
    '<line x1="56" y1="176" x2="80" y2="40" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="22"/>' +
    '<line x1="176" y1="40" x2="200" y2="176" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="22"/>' +
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
      '<div id="nexus-fab-ring-outer" aria-hidden="true"></div>' +
      '<div id="nexus-fab-aura" aria-hidden="true"></div>' +
      '<div id="nexus-fab-body">' +
        '<div id="nexus-fab-icon-wrap">' +
          '<span id="nexus-fab-icon">' + _iconFab() + '</span>' +
        '</div>' +
      '</div>' +
      '<span class="nexus-fab-badge" aria-hidden="true"></span>' +
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
        '<button id="nexus-pin" type="button" aria-label="Fixar janela" aria-pressed="false">' +
          _iconPin() +
        '</button>' +
        '<button id="nexus-drag-toggle" type="button" aria-label="Ativar modo arrastar" aria-pressed="false">' +
          _iconMove() +
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
    var blocosCodigo = [];

    var semCodigo = texto.replace(/`([^`\n]+)`/g, function (_, conteudo) {
      var idx = blocosCodigo.push(conteudo) - 1;
      return '\u0000CODE' + idx + '\u0000';
    });

    var escaped = _escapeHtml(semCodigo);

    escaped = escaped.replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>');
    escaped = escaped.replace(/(^|[^*])\*([^*\n]+?)\*(?!\*)/g, '$1<em>$2</em>');

    escaped = escaped.replace(/\u0000CODE(\d+)\u0000/g, function (_, idx) {
      var original = _escapeHtml(blocosCodigo[Number(idx)]);
      return '<code class="nexus-inline-code">' + original + '</code>';
    });

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

  function _renderAcoes(comEditar) {
    return (
      '<div class="nexus-msg-actions">' +
        (comEditar
          ? '<button type="button" class="nexus-msg-action-btn nexus-action-edit"' +
            ' aria-label="Editar mensagem" title="Editar">' +
              _iconEdit() +
            '</button>'
          : '') +
        '<button type="button" class="nexus-msg-action-btn nexus-action-copy"' +
        ' aria-label="Copiar mensagem" title="Copiar">' +
          _iconCopy() +
        '</button>' +
      '</div>'
    );
  }

  function _calcularVersaoAtual(msg) {
    if (msg.tree && msg.tree.nodes && msg.tree.rootId && msg.tree.activeId) {
      var sentinela = msg.tree.nodes[msg.tree.rootId];
      if (!sentinela || !Array.isArray(sentinela.childrenIds)) return null;
      var irmaos = sentinela.childrenIds;
      if (irmaos.length < 2) return null;
      var pos = irmaos.indexOf(msg.tree.activeId);
      if (pos === -1) return null;
      return { atual: pos + 1, total: irmaos.length };
    }

    if (Array.isArray(msg.versions) && msg.versions.length >= 2) {
      return { atual: (msg.versionIndex || 0) + 1, total: msg.versions.length };
    }

    return null;
  }

  function _renderVersionSwitch(msg) {
    var info = _calcularVersaoAtual(msg);
    if (!info) return '';
    return (
      '<div class="nexus-msg-versions">' +
        '<button type="button" class="nexus-version-prev" aria-label="Versão anterior">&lt;</button>' +
        '<span class="nexus-version-label">' + info.atual + '/' + info.total + '</span>' +
        '<button type="button" class="nexus-version-next" aria-label="Próxima versão">&gt;</button>' +
      '</div>'
    );
  }

  function _copiarTexto(texto, btn) {
    function _sucesso() {
      if (!btn) return;
      var originalHTML = btn.innerHTML;
      btn.innerHTML = _iconCheck();
      btn.classList.add('nexus-action-copiado');
      btn.setAttribute('aria-label', 'Copiado');
      setTimeout(function () {
        btn.innerHTML = originalHTML;
        btn.classList.remove('nexus-action-copiado');
        btn.setAttribute('aria-label', 'Copiar mensagem');
      }, 1400);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(_sucesso).catch(function () {
        _copiarFallback(texto, _sucesso);
      });
    } else {
      _copiarFallback(texto, _sucesso);
    }
  }

  function _copiarFallback(texto, onSucesso) {
    try {
      var ta = document.createElement('textarea');
      ta.value = texto;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      if (typeof onSucesso === 'function') onSucesso();
    } catch (e) {
      console.warn('[NexusUI] não foi possível copiar:', e);
    }
  }

  function _editarMensagem(el, textoOriginal, msgIndex) {
    var bubble = el.querySelector('.nexus-msg-bubble');
    if (!bubble) return;

    var ta = document.createElement('textarea');
    ta.className = 'nexus-edit-inline';
    ta.value = textoOriginal;
    bubble.replaceWith(ta);
    ta.focus();
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
    ta.setSelectionRange(ta.value.length, ta.value.length);

    function _confirmar() {
      var novo = ta.value.trim();
      ta.removeEventListener('keydown', _onKey);
      ta.removeEventListener('blur', _confirmar);
      if (!novo || novo === textoOriginal) {
        ta.replaceWith(bubble);
        return;
      }
      if (typeof _onEdit === 'function') _onEdit(msgIndex, novo);
    }

    function _onKey(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        _confirmar();
      }
      if (e.key === 'Escape') {
        ta.removeEventListener('blur', _confirmar);
        ta.replaceWith(bubble);
      }
    }

    ta.addEventListener('keydown', _onKey);
    ta.addEventListener('blur', _confirmar);
    ta.addEventListener('input', function () {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 160) + 'px';
    });
  }

  function _bindAcoesMensagem(el, textoOriginal, msgIndex) {
    var copyBtn = el.querySelector('.nexus-action-copy');
    if (copyBtn) {
      copyBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        _copiarTexto(textoOriginal, copyBtn);
      });
    }

    var editBtn = el.querySelector('.nexus-action-edit');
    if (editBtn) {
      editBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        _editarMensagem(el, textoOriginal, msgIndex);
      });
    }
  }

  function _bindVersionSwitch(el, msgIndex) {
    var prevBtn = el.querySelector('.nexus-version-prev');
    var nextBtn = el.querySelector('.nexus-version-next');
    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (typeof _onVersionSwitch === 'function') _onVersionSwitch(msgIndex, -1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (typeof _onVersionSwitch === 'function') _onVersionSwitch(msgIndex, 1);
      });
    }
  }

  function renderMessage(msg) {
    var container = document.getElementById('nexus-messages');
    if (!container) return;

    var el = document.createElement('div');
    var msgIndex = msg.__idx;

    if (msg.role === 'user') {
      el.className = 'nexus-msg nexus-user';
      el.innerHTML =
        '<div class="nexus-msg-avatar" aria-hidden="true">' + _iconUser() + '</div>' +
        '<div class="nexus-msg-wrap">' +
          '<div class="nexus-msg-bubble">' + _formatarTexto(msg.text) + '</div>' +
          _renderAcoes(true) +
          _renderVersionSwitch(msg) +
        '</div>';
      _bindAcoesMensagem(el, msg.text, msgIndex);
      _bindVersionSwitch(el, msgIndex);

    } else if (msg.role === 'bot') {
      el.className = 'nexus-msg nexus-bot';
      el.innerHTML =
        '<div class="nexus-msg-avatar" aria-hidden="true">' + _iconBot() + '</div>' +
        '<div class="nexus-msg-wrap">' +
          '<div class="nexus-msg-bubble">' +
            _formatarTexto(msg.text) +
            _renderRodape(msg.rodape) +
          '</div>' +
          _renderAcoes(false) +
        '</div>';
      _bindAcoesMensagem(el, msg.text, msgIndex);

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
    var footer = document.getElementById('nexus-footer');
    if (footer && el.parentNode !== footer) {
      footer.insertBefore(el, footer.firstChild);
    }
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
        if (typeof _playSound === 'function') _playSound('click', 'inicial');
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
     LIMPAR MENSAGENS
  ══════════════════════════════════════════════════════════ */

  function limparMensagens() {
    var container = document.getElementById('nexus-messages');
    if (container) container.innerHTML = '';
  }

  /* ══════════════════════════════════════════════════════════
     ESTADOS VISUAIS DO FAB — pensando / nova mensagem
     ────────────────────────────────────────────────────────
     setThinking(bool)    → liga/desliga .nexus-fab--thinking.
                             Chamado pelo domínio ao iniciar/concluir
                             uma chamada ao modelo. Idempotente.
     notifyNewMessage()   → dispara .nexus-fab--newmsg uma única vez
                             (flash + badge) e remove a classe ao fim
                             da animação, sem precisar de timer manual
                             no chamador. Não faz nada se o painel já
                             estiver aberto (o usuário já está vendo
                             a mensagem chegar).
  ══════════════════════════════════════════════════════════ */

  var _newMsgTimeout = null;

  function setThinking(ativo) {
    var fab = document.getElementById('nexus-fab');
    if (!fab) return;
    fab.classList.toggle('nexus-fab--thinking', !!ativo);
  }

  function notifyNewMessage() {
    var fab = document.getElementById('nexus-fab');
    var panel = document.getElementById('nexus-panel');
    if (!fab) return;

    /* Painel já aberto: o usuário já vê a mensagem renderizada,
       o flash no FAB seria redundante/distrativo. */
    if (panel && panel.classList.contains('nexus-open')) return;

    fab.classList.remove('nexus-fab--newmsg');
    void fab.offsetWidth; /* força reflow para permitir retrigger */
    fab.classList.add('nexus-fab--newmsg');

    if (_newMsgTimeout) clearTimeout(_newMsgTimeout);
    _newMsgTimeout = setTimeout(function () {
      fab.classList.remove('nexus-fab--newmsg');
    }, 2500);
  }

  /* ══════════════════════════════════════════════════════════
     CONTROLE DO PAINEL (abrir / fechar / toggle)
  ══════════════════════════════════════════════════════════ */

  function _setPainelAberto(aberto) {
    var fab   = document.getElementById('nexus-fab');
    var panel = document.getElementById('nexus-panel');
    if (!fab || !panel) return;

    if (aberto) {
      if (typeof _playSound === 'function') _playSound('openModal', 'inicial');
      panel.classList.add('nexus-open');
      fab.classList.add('nexus-active');
      fab.setAttribute('aria-expanded', 'true');

      var input = document.getElementById('nexus-input');
      if (input) setTimeout(function () { input.focus(); }, 260);

    } else {
      if (typeof _playSound === 'function') _playSound('closeModal', 'inicial');
      panel.classList.remove('nexus-open');
      fab.classList.remove('nexus-active');
      fab.setAttribute('aria-expanded', 'false');
    }
  }

  function open()  { _setPainelAberto(true);  }
  function close() { _setPainelAberto(false); }

  /* ── SHAKE DO FAB ────────────────────────────────────────────
     Padrão clássico para reutilização em cliques consecutivos:
       1. remove a classe (caso ainda esteja de um disparo anterior)
       2. força reflow — sem isso o browser não detecta a mudança
          no mesmo frame e a animação não toca de novo
       3. adiciona a classe → inicia a animação
       4. remove no animationend com listener de uso único         */
  function _dispararShakeFAB() {
    var fab = document.getElementById('nexus-fab');
    if (!fab) return;

    fab.classList.remove('nexus-fab--shake');
    void fab.offsetWidth;
    fab.classList.add('nexus-fab--shake');

    fab.addEventListener('animationend', function () {
      fab.classList.remove('nexus-fab--shake');
    }, { once: true });
  }

  function toggle() {
    if (!_guardCarregado || !_verificadoLogado()) {
      _dispararShakeFAB();
      if (typeof _playSound === 'function') _playSound('click', 'inicial');
      return;
    }

    var panel = document.getElementById('nexus-panel');
    if (!panel) return;
    _setPainelAberto(!panel.classList.contains('nexus-open'));
  }

  /* ══════════════════════════════════════════════════════════
     SCROLL ISOLADO
  ══════════════════════════════════════════════════════════ */

  function _bindScrollIsolado(panel) {
    panel.addEventListener('wheel', function (e) {
      var messages = document.getElementById('nexus-messages');
      if (!messages) return;

      var atTop    = messages.scrollTop === 0;
      var atBottom = messages.scrollTop + messages.clientHeight >= messages.scrollHeight - 1;
      var scrollingUp   = e.deltaY < 0;
      var scrollingDown = e.deltaY > 0;

      if ((scrollingUp && atTop) || (scrollingDown && atBottom)) {
        e.preventDefault();
      }
      e.stopPropagation();
    }, { passive: false });

    var _touchStartY = 0;
    panel.addEventListener('touchstart', function (e) {
      _touchStartY = e.touches[0].clientY;
    }, { passive: true });

    panel.addEventListener('touchmove', function (e) {
      var messages = document.getElementById('nexus-messages');
      if (!messages) return;

      var deltaY   = _touchStartY - e.touches[0].clientY;
      var atTop    = messages.scrollTop === 0;
      var atBottom = messages.scrollTop + messages.clientHeight >= messages.scrollHeight - 1;

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
      if (typeof _playSound === 'function') _playSound('click', 'inicial');
      if (typeof _onReset === 'function') _onReset();
    });
  }

  /* ══════════════════════════════════════════════════════════
     MODO ARRASTAR (DRAGGABLE)
  ══════════════════════════════════════════════════════════ */

  var DRAG_ATIVO_KEY = 'nexus_chat_drag_ativo';
  var DRAG_POS_KEY   = 'nexus_chat_drag_pos';

  var _dragState = {
    ativo:      false,
    arrastando: false,
    offsetX:    0,
    offsetY:    0,
  };

  function _lerDragAtivo() {
    try { return localStorage.getItem(DRAG_ATIVO_KEY) === '1'; }
    catch (e) { return false; }
  }

  function _salvarDragAtivo(ativo) {
    try {
      if (ativo) localStorage.setItem(DRAG_ATIVO_KEY, '1');
      else       localStorage.removeItem(DRAG_ATIVO_KEY);
    } catch (e) {}
  }

  function _lerDragPos() {
    try {
      var raw = localStorage.getItem(DRAG_POS_KEY);
      if (!raw) return null;
      var pos = JSON.parse(raw);
      if (typeof pos.top !== 'number' || typeof pos.left !== 'number') return null;
      return pos;
    } catch (e) { return null; }
  }

  function _salvarDragPos(top, left) {
    try { localStorage.setItem(DRAG_POS_KEY, JSON.stringify({ top: top, left: left })); }
    catch (e) {}
  }

  function _limparDragPos() {
    try { localStorage.removeItem(DRAG_POS_KEY); } catch (e) {}
  }

  function _clampPos(top, left, panel) {
    var margem = 8;
    var maxLeft = window.innerWidth  - panel.offsetWidth  - margem;
    var maxTop  = window.innerHeight - panel.offsetHeight - margem;
    left = Math.min(Math.max(left, margem), Math.max(maxLeft, margem));
    top  = Math.min(Math.max(top,  margem), Math.max(maxTop,  margem));
    return { top: top, left: left };
  }

  function _aplicarPosicaoSalva() {
    var panel = document.getElementById('nexus-panel');
    if (!panel) return;
    var pos = _lerDragPos();
    if (!pos) return;
    var clamped = _clampPos(pos.top, pos.left, panel);
    panel.style.top  = clamped.top  + 'px';
    panel.style.left = clamped.left + 'px';
  }

  function _ativarModoDrag() {
    var panel  = document.getElementById('nexus-panel');
    var header = document.getElementById('nexus-header');
    var toggle = document.getElementById('nexus-drag-toggle');
    if (!panel || !header) return;

    _dragState.ativo = true;

    var posSalva  = _lerDragPos();
    var rectAntes = !posSalva ? panel.getBoundingClientRect() : null;

    panel.classList.add('nexus-panel--draggable');
    header.classList.add('nexus-drag-enabled');
    if (toggle) {
      toggle.classList.add('nexus-drag-ativo');
      toggle.setAttribute('aria-pressed', 'true');
      toggle.setAttribute('aria-label', 'Desativar modo arrastar');
      toggle.title = 'Desativar modo arrastar';
    }

    if (posSalva) {
      _aplicarPosicaoSalva();
    } else {
      panel.style.top  = rectAntes.top  + 'px';
      panel.style.left = rectAntes.left + 'px';
      _salvarDragPos(rectAntes.top, rectAntes.left);
    }

    _salvarDragAtivo(true);
  }

  function _desativarModoDrag() {
    var panel  = document.getElementById('nexus-panel');
    var header = document.getElementById('nexus-header');
    var toggle = document.getElementById('nexus-drag-toggle');
    if (!panel || !header) return;

    _dragState.ativo = false;
    panel.classList.remove('nexus-panel--draggable');
    panel.style.top  = '';
    panel.style.left = '';
    header.classList.remove('nexus-drag-enabled');
    if (toggle) {
      toggle.classList.remove('nexus-drag-ativo');
      toggle.setAttribute('aria-pressed', 'false');
      toggle.setAttribute('aria-label', 'Ativar modo arrastar');
      toggle.title = 'Ativar modo arrastar';
    }

    _salvarDragAtivo(false);
    _limparDragPos();
  }

  function _onDragStart(clientX, clientY) {
    var panel = document.getElementById('nexus-panel');
    if (!panel || !_dragState.ativo) return;
    var rect = panel.getBoundingClientRect();
    _dragState.arrastando = true;
    _dragState.offsetX = clientX - rect.left;
    _dragState.offsetY = clientY - rect.top;
    panel.classList.add('nexus-dragging');
  }

  function _onDragMove(clientX, clientY) {
    if (!_dragState.arrastando) return;
    var panel = document.getElementById('nexus-panel');
    if (!panel) return;
    var novoTop  = clientY - _dragState.offsetY;
    var novoLeft = clientX - _dragState.offsetX;
    var clamped  = _clampPos(novoTop, novoLeft, panel);
    panel.style.top  = clamped.top  + 'px';
    panel.style.left = clamped.left + 'px';
  }

  function _onDragEnd() {
    if (!_dragState.arrastando) return;
    _dragState.arrastando = false;
    var panel = document.getElementById('nexus-panel');
    if (!panel) return;
    panel.classList.remove('nexus-dragging');
    var top  = parseFloat(panel.style.top)  || 0;
    var left = parseFloat(panel.style.left) || 0;
    _salvarDragPos(top, left);
  }

  function _bindDrag() {
    var header = document.getElementById('nexus-header');
    var toggle = document.getElementById('nexus-drag-toggle');
    if (!header || !toggle) return;

    if (header.dataset.nexusDragBound) return;
    header.dataset.nexusDragBound = '1';

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (typeof _playSound === 'function') _playSound('click', 'inicial');
      if (_dragState.ativo) _desativarModoDrag();
      else _ativarModoDrag();
    });

    header.addEventListener('mousedown', function (e) {
      if (!_dragState.ativo) return;
      if (e.target.closest('button')) return;
      e.preventDefault();
      _onDragStart(e.clientX, e.clientY);
    });

    document.addEventListener('mousemove', function (e) {
      if (!_dragState.arrastando) return;
      _onDragMove(e.clientX, e.clientY);
    });

    document.addEventListener('mouseup', _onDragEnd);

    header.addEventListener('touchstart', function (e) {
      if (!_dragState.ativo) return;
      if (e.target.closest('button')) return;
      var t = e.touches[0];
      _onDragStart(t.clientX, t.clientY);
    }, { passive: true });

    header.addEventListener('touchmove', function (e) {
      if (!_dragState.arrastando) return;
      var t = e.touches[0];
      _onDragMove(t.clientX, t.clientY);
      e.preventDefault();
      e.stopPropagation();
    }, { passive: false });

    header.addEventListener('touchend', _onDragEnd);

    window.addEventListener('resize', function () {
      if (!_dragState.ativo) return;
      var panel = document.getElementById('nexus-panel');
      if (!panel || !panel.style.top) return;
      var clamped = _clampPos(parseFloat(panel.style.top), parseFloat(panel.style.left), panel);
      panel.style.top  = clamped.top  + 'px';
      panel.style.left = clamped.left + 'px';
      _salvarDragPos(clamped.top, clamped.left);
    });

    if (_lerDragAtivo()) {
      requestAnimationFrame(function () { _ativarModoDrag(); });
    }
  }

  /* ══════════════════════════════════════════════════════════
     PIN — fixar janela
     ────────────────────────────────────────────────────────
     Quando ativo, bloqueia o fechamento por clique fora e ESC.
     X e botão do FAB continuam fechando normalmente.
     Estado persiste via sessionStorage durante a sessão.
  ══════════════════════════════════════════════════════════ */

  var PIN_KEY   = 'nexus_chat_pin';
  var _pinAtivo = false;

  function _lerPin() {
    try { return sessionStorage.getItem(PIN_KEY) === '1'; }
    catch (e) { return false; }
  }

  function _salvarPin(ativo) {
    try {
      if (ativo) sessionStorage.setItem(PIN_KEY, '1');
      else       sessionStorage.removeItem(PIN_KEY);
    } catch (e) {}
  }

  function _atualizarBotaoPin(btn, ativo) {
    if (!btn) return;
    btn.classList.toggle('nexus-pin--ativo', ativo);
    btn.setAttribute('aria-pressed', String(ativo));
    btn.setAttribute('aria-label', ativo ? 'Desafixar janela' : 'Fixar janela');
    btn.title = ativo ? 'Desafixar janela' : 'Fixar janela';
  }

  function _bindPin() {
    var btn = document.getElementById('nexus-pin');
    if (!btn || btn.dataset.nexusPinBound) return;
    btn.dataset.nexusPinBound = '1';

    _pinAtivo = _lerPin();
    _atualizarBotaoPin(btn, _pinAtivo);

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (typeof _playSound === 'function') _playSound('click', 'inicial');
      _pinAtivo = !_pinAtivo;
      _salvarPin(_pinAtivo);
      _atualizarBotaoPin(btn, _pinAtivo);
    });
  }

  /* ══════════════════════════════════════════════════════════
     FECHAR AO CLICAR FORA
     ────────────────────────────────────────────────────────
     Registrado uma única vez em document (mousedown).
     Não age se: pin ativo, painel fechado, clique dentro do
     painel ou no próprio FAB.
  ══════════════════════════════════════════════════════════ */

  function _bindFecharFora() {
    document.addEventListener('mousedown', function (e) {
      if (_pinAtivo) return;

      var panel = document.getElementById('nexus-panel');
      var fab   = document.getElementById('nexus-fab');
      if (!panel || !panel.classList.contains('nexus-open')) return;

      /* Clique dentro do painel ou no FAB → não fecha */
      if (panel.contains(e.target)) return;
      if (fab && fab.contains(e.target)) return;

      close();
    });
  }

  /* ══════════════════════════════════════════════════════════
     FECHAR COM ESC
     ────────────────────────────────────────────────────────
     Registrado uma única vez em document (keydown).
     Não age se: pin ativo, painel fechado, ou foco em campo
     de texto externo ao painel (não interfere com outros atalhos).
  ══════════════════════════════════════════════════════════ */

function _bindESC() {
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;

    var panel = document.getElementById('nexus-panel');
    if (!panel || !panel.classList.contains('nexus-open')) return;

    var ativo = document.activeElement;
    if (ativo && !panel.contains(ativo)) {
      var tag = ativo.tagName;
      if (tag === 'TEXTAREA' || tag === 'INPUT' || tag === 'SELECT') return;
    }

    close();
  });
}

  /* ══════════════════════════════════════════════════════════
     INICIALIZAÇÃO
  ══════════════════════════════════════════════════════════ */

  function init(opts) {
    opts             = opts || {};
    _onSend          = opts.onSend          || null;
    _onReset         = opts.onReset         || null;
    _onEdit          = opts.onEdit          || null;
    _onVersionSwitch = opts.onVersionSwitch || null;

    var fab = document.getElementById('nexus-fab') || _criarFAB();
    if (!fab.parentNode) document.body.appendChild(fab);

    if (!fab.dataset.nexusBound) {
      fab.addEventListener('click', toggle);
      fab.dataset.nexusBound = '1';
    }

    if (!document.getElementById('nexus-panel')) {
      var panel = _criarPainel();
      document.body.appendChild(panel);
      document.getElementById('nexus-close').addEventListener('click', close);
    }

    _bindInput();
    _bindReset();
    _bindDrag();
    _bindPin();
    _bindFecharFora();
    _bindESC();

    _guardBindEventos();
    _guardVerificar();

    var panel = document.getElementById('nexus-panel');
    if (panel) _bindScrollIsolado(panel);
  }

  /* ══════════════════════════════════════════════════════════
     API PÚBLICA
  ══════════════════════════════════════════════════════════ */

  window.NexusUI = {
    init,
    open,
    close,
    toggle,
    renderMessage,
    showTyping,
    hideTyping,
    mostrarSugestoes,
    atualizarDiscAtiva,
    limparMensagens,
    setThinking,
    notifyNewMessage,
  };

}());