/* ============================================================
   NEXUS STUDY — quiz/quiz_ui.js  (v2 — suporte semestre 2026.1)
   Utilitários de interface — sem estado do quiz

   ÍNDICE:
     1. Scroll .................. L.22
     2. Markup inline ........... L.59
     3. Highlight de código ..... L.96
     4. Modal de Legenda ........ L.222

   Expõe: window.QuizUI {
     smoothScrollTo, smoothScrollToTop,
     renderMarkup, renderCodeBlock,
     initLegendaModal
   }

   SEMESTRES ESPECIAIS:
     2026.1 → lê os tipos reais de window.questoes (dinâmico)
              e exibe no modal em vez dos tipos padrão por modo.
              Para adicionar outro semestre especial, siga o mesmo
              padrão: adicione a chave em _TIPOS_SEMESTRE_ESPECIAL
              e o semestre em _isSemestreEspecial().
   ============================================================ */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     1. SCROLL
     ══════════════════════════════════════════════════════════ */

  var _scrollCancelled = false;

  function cancelScroll() { _scrollCancelled = true; }

  function smoothScrollTo(targetPosition, duration) {
    duration = duration || 800;
    _scrollCancelled = false;
    var start     = window.scrollY;
    var change    = targetPosition - start;
    var startTime = performance.now();

    function animateScroll(currentTime) {
      if (_scrollCancelled) return;
      var elapsed  = currentTime - startTime;
      var progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, start + change * progress);
      if (progress < 1) requestAnimationFrame(animateScroll);
    }
    requestAnimationFrame(animateScroll);
  }

  function smoothScrollToTop() { smoothScrollTo(0, 800); }

  window.addEventListener('wheel',     cancelScroll, { passive: true });
  window.addEventListener('touchmove', cancelScroll, { passive: true });
  window.addEventListener('keydown',   cancelScroll, { passive: true });

  /* ══════════════════════════════════════════════════════════
     2. MARKUP INLINE
     ══════════════════════════════════════════════════════════ */

  function renderMarkup(text) {
    if (!text) return '';

    var s = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    s = s.replace(/==([a-z]+)==([^=]+)==/g, function (_, cat, content) {
      var classMap = {
        def:    'chip chip-ddl',
        proc:   'chip chip-dml',
        rule:   'chip chip-key',
        term:   'chip chip-type',
        warn:   'chip chip-danger',
        mark:   'chip chip-mark',
        ddl:    'chip chip-ddl',
        dml:    'chip chip-dml',
        key:    'chip chip-key',
        type:   'chip chip-type',
        danger: 'chip chip-danger',
      };
      var cls = classMap[cat] || 'chip chip-mark';
      return '<span class="' + cls + '">' + content + '</span>';
    });

    s = s.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\/\/([^/]+)\/\//g, '<em>$1</em>');

    return s;
  }

  /* ══════════════════════════════════════════════════════════
     3. HIGHLIGHT DE CÓDIGO (SQL + Java + Python)
     ══════════════════════════════════════════════════════════ */

  function detectLang(raw) {
    if (/\b(SELECT|INSERT|UPDATE|DELETE|CREATE\s+TABLE|ALTER\s+TABLE|DROP\s+TABLE|FOREIGN\s+KEY|PRIMARY\s+KEY|REFERENCES|VARCHAR|INTEGER|NOT\s+NULL)\b/i.test(raw)) return 'sql';
    if (/\b(def |class |import |from |print\(|elif |lambda )\b/.test(raw)) return 'python';
    return 'java';
  }

  function highlightSQL(raw) {
    var code = raw
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    var strings = [];
    code = code.replace(/'([^']*)'/g, function (m) {
      strings.push(m);
      return '\x00STR' + (strings.length - 1) + '\x00';
    });

    code = code.replace(/(--[^\n]*)/g, '<span class="jk-comment">$1</span>');
    code = code.replace(
      /\b(SELECT|INSERT\s+INTO|INSERT|UPDATE|DELETE|CREATE\s+TABLE|CREATE|ALTER\s+TABLE|ALTER|DROP\s+TABLE|DROP|TRUNCATE|FROM|WHERE|JOIN|LEFT\s+JOIN|RIGHT\s+JOIN|INNER\s+JOIN|OUTER\s+JOIN|ON|GROUP\s+BY|ORDER\s+BY|HAVING|LIMIT|OFFSET|UNION|ALL|DISTINCT|AS|SET|VALUES|INTO|AND|OR|NOT|IN|EXISTS|LIKE|BETWEEN|IS\s+NULL|IS\s+NOT\s+NULL|IS|NULL|PRIMARY\s+KEY|FOREIGN\s+KEY|REFERENCES|UNIQUE|CHECK|DEFAULT|NOT\s+NULL|CONSTRAINT|INDEX|CASCADE|RESTRICT|NO\s+ACTION|ON\s+DELETE|ON\s+UPDATE|AUTO_INCREMENT|SERIAL)\b/gi,
      '<span class="jk-keyword">$1</span>'
    );
    code = code.replace(
      /\b(INTEGER|INT|BIGINT|SMALLINT|TINYINT|FLOAT|DOUBLE|DECIMAL|NUMERIC|REAL|CHAR|VARCHAR|TEXT|NVARCHAR|BLOB|CLOB|DATE|TIME|DATETIME|TIMESTAMP|BOOLEAN|BOOL|SERIAL|BYTEA|UUID|JSON|JSONB|ARRAY)\b/gi,
      '<span class="jk-type">$1</span>'
    );
    code = code.replace(/\b(TRUE|FALSE|NULL)\b/gi, '<span class="jk-literal">$1</span>');
    code = code.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="jk-number">$1</span>');
    code = code.replace(/\x00STR(\d+)\x00/g, function (_, i) {
      return '<span class="jk-string">' + strings[+i] + '</span>';
    });

    return code;
  }

  function highlightJava(raw) {
    var code = raw
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    var strings = [];
    code = code.replace(/"([^"]*)"/g, function (m) {
      strings.push(m);
      return '\x00STR' + (strings.length - 1) + '\x00';
    });

    code = code.replace(/(@\w+)/g, '<span class="jk-annotation">$1</span>');
    code = code.replace(
      /\b(public|private|protected|class|interface|extends|implements|return|void|double|int|long|float|boolean|char|byte|short|String|new|this|super|static|final|abstract|null|true|false|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|throws|import|package)\b/g,
      '<span class="jk-keyword">$1</span>'
    );
    code = code.replace(/(\/\/[^\n]*)/g, '<span class="jk-comment">$1</span>');
    code = code.replace(/\x00STR(\d+)\x00/g, function (_, i) {
      return '<span class="jk-string">' + strings[+i] + '</span>';
    });

    return code;
  }

  function highlightPython(raw) {
    var code = raw
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    var strings = [];
    code = code.replace(/"""([\s\S]*?)"""|'''([\s\S]*?)'''|"([^"\\]*(\\.[^"\\]*)*)"|'([^'\\]*(\\.[^'\\]*)*)'/g, function (m) {
      strings.push(m);
      return '\x00STR' + (strings.length - 1) + '\x00';
    });

    code = code.replace(/(#[^\n]*)/g, '<span class="jk-comment">$1</span>');
    code = code.replace(/@(\w+)/g, '<span class="jk-decorator">@$1</span>');
    code = code.replace(
      /\b(def|class|return|import|from|as|if|elif|else|for|while|in|not|and|or|is|lambda|pass|break|continue|try|except|finally|raise|with|yield|global|nonlocal|del|assert|True|False|None|print|len|range|type|str|int|float|list|dict|tuple|set|bool)\b/g,
      '<span class="jk-keyword">$1</span>'
    );
    code = code.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="jk-number">$1</span>');
    code = code.replace(/\x00STR(\d+)\x00/g, function (_, i) {
      return '<span class="jk-string">' + strings[+i] + '</span>';
    });

    return code;
  }

  function highlightCode(raw) {
    var lang = detectLang(raw);
    if (lang === 'sql')    return highlightSQL(raw);
    if (lang === 'python') return highlightPython(raw);
    return highlightJava(raw);
  }

  function renderCodeBlock(code) {
    if (!code) return '';
    return '<div class="code-block"><pre>' + highlightCode(code) + '</pre></div>';
  }

  /* ══════════════════════════════════════════════════════════
     4. MODAL DE LEGENDA
     ══════════════════════════════════════════════════════════ */

  /* ──────────────────────────────────────────────────────────
     SEMESTRES ESPECIAIS — tipos lidos dinamicamente do conteúdo
     ──────────────────────────────────────────────────────────
     Para cada semestre especial, defina um mapa de tipos com
     a configuração visual de cada um. A chave do mapa deve ser
     exatamente o valor do campo "tipo" nas questões do conteúdo.

     Para adicionar um novo semestre especial:
       1. Adicione a chave (semestre) em _TIPOS_SEMESTRE_ESPECIAL
       2. Defina o mapa de tipos com { iconCls, iconTxt, nome, desc }
       3. Pronto — nenhum outro arquivo precisa mudar.
     ────────────────────────────────────────────────────────── */
var _TIPOS_SEMESTRE_ESPECIAL = {

  '2026.1': {
    'Contextualizada': {
      iconCls: 'nlg-icon-con',
      iconTxt: 'CTX',
      nome:    'Contextualizada',
      desc:    'Situação-contexto antes da pergunta — interprete e responda',
    },
    'Asserção': {
      iconCls: 'nlg-icon-aj',
      iconTxt: 'A+J',
      nome:    'Asserção + Justificativa',
      desc:    'Duas afirmativas ligadas por PORQUE — avalie cada uma separadamente',
    },
    'Afirmativas': {
      iconCls: 'nlg-icon-ma',
      iconTxt: 'I–IV',
      nome:    'Múltiplas afirmativas',
      desc:    'Avalie quais afirmativas estão corretas e marque a combinação certa',
    },
  },

  '2026.1-AP1': null,   // herda de '2026.1'
  '2026.1-AP2': null,   // herda de '2026.1'

};

  /* Retorna true se o semestre usa leitura dinâmica de tipos */
function _isSemestreEspecial(sem) {
  return Object.prototype.hasOwnProperty.call(_TIPOS_SEMESTRE_ESPECIAL, sem);
}

/* Retorna o mapa de tipos do semestre, seguindo herança para semestres com sufixo */
function _resolverMapaTipos(sem) {
  var mapa = _TIPOS_SEMESTRE_ESPECIAL[sem];
  if (mapa !== null && mapa !== undefined) return mapa;
  /* mapa === null → herda pelo período base (ex: '2026.1-AP2' → '2026.1') */
  var periodo = sem.includes('-') ? sem.split('-')[0] : sem;
  return _TIPOS_SEMESTRE_ESPECIAL[periodo] || null;
}

  /* ──────────────────────────────────────────────────────────
     _buildTiposEspecial
     Lê window.questoes (já carregado antes deste script),
     extrai os tipos únicos na ordem de aparição e monta as
     linhas de tipo para o modal.
     ────────────────────────────────────────────────────────── */
function _buildTiposEspecial(listEl, sem, modo, _tipoRow, tipoMap) {
  tipoMap = tipoMap || _resolverMapaTipos(sem);
    var conteudo  = window.questoes || {};

    /* Escolhe a lista certa conforme o modo ativo */
// quiz_ui.js — _buildTiposEspecial, linha ~268
var lista = modo === 'ava'
  ? (conteudo.ava      || [])
  : modo === 'enade'
  ? (conteudo.enade    || [])
  : modo === 'fixacao'
  ? (conteudo.fixacao  || [])
  : (conteudo.questoes || []);

    /* Extrai tipos únicos preservando a ordem de aparição */
    var vistos  = {};
    var tiposOrdem = [];
    for (var i = 0; i < lista.length; i++) {
      var t = lista[i].tipo;
      if (t && !vistos[t]) {
        vistos[t] = true;
        tiposOrdem.push(t);
      }
    }

    /* Sem questões carregadas → mensagem de fallback */
    if (tiposOrdem.length === 0) {
      var aviso = document.createElement('div');
      aviso.className = 'nlg-enade-block';
      aviso.style.cssText = 'opacity:0.6;';
      aviso.textContent   = 'Tipos não identificados — conteúdo não carregado.';
      listEl.appendChild(aviso);
      return;
    }

    /* Renderiza cada tipo encontrado */
    for (var j = 0; j < tiposOrdem.length; j++) {
      var cfg = tipoMap[tiposOrdem[j]];
      if (cfg) {
        /* Tipo conhecido — usa configuração visual completa */
        listEl.appendChild(_tipoRow(cfg.iconCls, cfg.iconTxt, cfg.nome, cfg.desc));
      } else {
        /* Tipo desconhecido no mapa — renderiza genérico */
        listEl.appendChild(_tipoRow(
          'nlg-icon-con',
          tiposOrdem[j].substring(0, 3).toUpperCase(),
          tiposOrdem[j],
          'Tipo identificado automaticamente do conteúdo'
        ));
      }
    }
  }

  /* ──────────────────────────────────────────────────────────
     initLegendaModal — função principal exportada
     ────────────────────────────────────────────────────────── */
  function initLegendaModal() {

    var style = document.createElement('style');
    style.id  = 'nexus-legenda-styles';
    style.textContent =
      '#nexus-legenda-overlay{position:fixed;inset:0;background:transparent;z-index:998;opacity:0;pointer-events:none;transition:opacity 0.2s ease;}' +
      '#nexus-legenda-overlay.nlg-show{opacity:1;pointer-events:all;}' +
      '#nexus-legenda-modal{position:fixed;right:60px;top:50%;transform:translateY(-50%) translateX(10px) scale(0.97);width:300px;background:rgba(10,15,26,0.97);border:1px solid rgba(255,255,255,0.10);border-top:1px solid rgba(255,255,255,0.16);border-radius:16px;box-shadow:0 0 0 1px rgba(var(--accent-rgb),0.08),0 24px 48px rgba(0,0,0,0.55),0 4px 16px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.06);z-index:999;opacity:0;pointer-events:none;transition:opacity 0.2s ease,transform 0.25s cubic-bezier(0.34,1.15,0.64,1);overflow:hidden;font-family:var(--font-body,"DM Sans",system-ui,sans-serif);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);}' +
      '#nexus-legenda-modal.nlg-show{opacity:1;pointer-events:all;transform:translateY(-50%) translateX(0) scale(1);}' +
      '.btn-legenda{background:rgba(var(--accent-rgb),0.06)!important;border-color:rgba(var(--accent-rgb),0.18)!important;color:rgba(var(--accent-rgb),0.5)!important;}' +
      '.btn-legenda:hover{background:rgba(var(--accent-rgb),0.14)!important;border-color:rgba(var(--accent-rgb),0.4)!important;color:var(--accent)!important;}' +
      '#btn-legenda.nlg-active{background:rgba(var(--accent-rgb),0.18)!important;border-color:rgba(var(--accent-rgb),0.55)!important;color:var(--accent)!important;box-shadow:0 0 0 2px rgba(var(--accent-rgb),0.12);}' +
      '.nlg-header{padding:0.9rem 1rem 0.75rem;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.06);background:linear-gradient(180deg,rgba(var(--accent-rgb),0.05) 0%,transparent 100%);}' +
      '.nlg-header-left{display:flex;flex-direction:column;gap:0.1rem;}' +
      '.nlg-eyebrow{font-size:0.52rem;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:var(--accent);opacity:0.55;}' +
      '.nlg-title{font-size:0.88rem;font-weight:600;color:#f0ede6;letter-spacing:-0.015em;}' +
      '.nlg-close{width:24px;height:24px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:6px;color:#6e6a62;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:0.65rem;flex-shrink:0;transition:all 0.18s;line-height:1;}' +
      '.nlg-close:hover{background:rgba(248,113,113,0.1);border-color:rgba(248,113,113,0.28);color:#fca5a5;}' +
      '.nlg-body{padding:0.65rem 0.85rem;display:flex;flex-direction:column;gap:0.5rem;max-height:68vh;overflow-y:auto;}' +
      '.nlg-body::-webkit-scrollbar{width:2px;}' +
      '.nlg-body::-webkit-scrollbar-thumb{background:rgba(var(--accent-rgb),0.2);border-radius:2px;}' +
      '.nlg-section-label{display:flex;align-items:center;gap:0.5rem;font-size:0.5rem;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.60);margin-bottom:0.2rem;}' +
      '.nlg-section-label::after{content:"";flex:1;height:1px;background:rgba(255,255,255,0.05);}' +
      '.nlg-divider{height:1px;background:rgba(255,255,255,0.05);margin:0.1rem 0;}' +
      '.nlg-tipo-row{display:flex;align-items:center;gap:0.6rem;padding:0.45rem 0.6rem;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:10px;transition:all 0.15s;cursor:default;}' +
      '.nlg-tipo-row:hover{background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.09);}' +
      '.nlg-tipo-icon{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:0.55rem;font-weight:800;letter-spacing:-0.03em;flex-shrink:0;font-family:var(--font-mono,"JetBrains Mono",monospace);}' +
      '.nlg-icon-aj{background:linear-gradient(135deg,rgba(122,168,232,0.18),rgba(122,168,232,0.08));color:#93c5fd;border:1px solid rgba(122,168,232,0.22);}' +
      '.nlg-icon-ma{background:linear-gradient(135deg,rgba(77,217,180,0.15),rgba(77,217,180,0.07));color:#5eead4;border:1px solid rgba(77,217,180,0.2);}' +
      '.nlg-icon-con{background:linear-gradient(135deg,rgba(251,191,36,0.15),rgba(251,191,36,0.07));color:#fbbf24;border:1px solid rgba(251,191,36,0.2);}' +
      '.nlg-icon-cod{background:linear-gradient(135deg,rgba(167,139,250,0.18),rgba(167,139,250,0.08));color:#c4b5fd;border:1px solid rgba(167,139,250,0.22);font-size:0.6rem;letter-spacing:-0.05em;}' +
      '.nlg-icon-ap{background:linear-gradient(135deg,rgba(248,113,113,0.15),rgba(248,113,113,0.07));color:#fca5a5;border:1px solid rgba(248,113,113,0.2);}' +
      '.nlg-tipo-info{display:flex;flex-direction:column;gap:1px;min-width:0;}' +
      '.nlg-tipo-nome{font-size:0.74rem;font-weight:500;color:#e8e4dc;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}' +
      '.nlg-tipo-desc{font-size:0.62rem;color:#a09b94;line-height:1.35;}' +
      '.nlg-chip-row{display:flex;align-items:center;gap:0.55rem;padding:0.38rem 0.6rem;background:rgba(255,255,255,0.015);border:1px solid rgba(255,255,255,0.045);border-radius:8px;transition:all 0.15s;cursor:default;}' +
      '.nlg-chip-row:hover{background:rgba(255,255,255,0.035);border-color:rgba(255,255,255,0.08);}' +
      '.nlg-chip{font-family:var(--font-mono,"JetBrains Mono",monospace);font-size:0.58rem;font-weight:700;letter-spacing:0.02em;padding:2px 6px;border-radius:4px;white-space:nowrap;flex-shrink:0;min-width:72px;text-align:center;}' +
      '.nlg-ddl{background:rgba(122,168,232,0.12);color:#93c5fd;border:1px solid rgba(122,168,232,0.25);}' +
      '.nlg-dml{background:rgba(77,217,180,0.10);color:#5eead4;border:1px solid rgba(77,217,180,0.22);}' +
      '.nlg-key{background:rgba(251,191,36,0.10);color:#fbbf24;border:1px solid rgba(251,191,36,0.22);}' +
      '.nlg-type{background:rgba(167,139,250,0.10);color:#c4b5fd;border:1px solid rgba(167,139,250,0.22);}' +
      '.nlg-danger{background:rgba(248,113,113,0.10);color:#fca5a5;border:1px solid rgba(248,113,113,0.22);}' +
      '.nlg-mark{background:rgba(var(--accent-rgb),0.10);color:var(--accent);border:1px solid rgba(var(--accent-rgb),0.22);}' +
      '.nlg-desc{display:flex;flex-direction:column;gap:0;min-width:0;}' +
      '.nlg-desc-main{font-size:0.72rem;font-weight:500;color:#ccc9c0;line-height:1.3;}' +
      '.nlg-desc-sub{font-size:0.6rem;color:#a09b94;line-height:1.3;}' +
      '.nlg-enade-block{padding:0.55rem 0.7rem;background:linear-gradient(135deg,rgba(var(--accent-rgb),0.07),rgba(var(--accent-rgb),0.03));border:1px solid rgba(var(--accent-rgb),0.14);border-radius:10px;display:flex;gap:0.55rem;align-items:flex-start;}' +
      '.nlg-enade-icon{font-size:0.85rem;line-height:1;flex-shrink:0;margin-top:1px;}' +
      '.nlg-enade-text{display:flex;flex-direction:column;gap:0.15rem;}' +
      '.nlg-enade-label{font-size:0.52rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--accent);opacity:0.7;}' +
      '.nlg-enade-desc{font-size:0.68rem;color:#8a8680;line-height:1.5;}' +
      '.nlg-footer{padding:0.5rem 0.85rem;border-top:1px solid rgba(255,255,255,0.05);display:flex;align-items:center;gap:0.35rem;background:rgba(0,0,0,0.15);}' +
      '.nlg-footer-dot{width:4px;height:4px;border-radius:50%;background:var(--accent);opacity:0.35;flex-shrink:0;}' +
      '.nlg-footer-text{font-size:0.58rem;color:#b5b0a8;letter-spacing:0.02em;line-height:1.4;}';

    document.head.appendChild(style);

    function _el(tag, cls, txt) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      if (txt !== undefined) e.textContent = txt;
      return e;
    }

    function _tipoRow(iconCls, iconTxt, nome, desc) {
      var row  = _el('div', 'nlg-tipo-row');
      var icon = _el('div', 'nlg-tipo-icon ' + iconCls, iconTxt);
      var info = _el('div', 'nlg-tipo-info');
      info.appendChild(_el('span', 'nlg-tipo-nome', nome));
      info.appendChild(_el('span', 'nlg-tipo-desc', desc));
      row.appendChild(icon);
      row.appendChild(info);
      return row;
    }

    function _chipRow(chipCls, label, main, sub) {
      var row  = _el('div', 'nlg-chip-row');
      var chip = _el('span', 'nlg-chip ' + chipCls, label);
      var desc = _el('div', 'nlg-desc');
      desc.appendChild(_el('span', 'nlg-desc-main', main));
      desc.appendChild(_el('span', 'nlg-desc-sub', sub));
      row.appendChild(chip);
      row.appendChild(desc);
      return row;
    }

    function _secao(labelTxt) {
      var wrap = _el('div');
      wrap.appendChild(_el('div', 'nlg-section-label', labelTxt));
      var list = _el('div');
      list.style.cssText = 'display:flex;flex-direction:column;gap:0.22rem;';
      wrap.appendChild(list);
      return { wrap: wrap, list: list };
    }

    var overlay = _el('div');
    overlay.id = 'nexus-legenda-overlay';
    document.body.appendChild(overlay);

    var modal = _el('div');
    modal.id = 'nexus-legenda-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Informações e tipos de questão');

    var header   = _el('div', 'nlg-header');
    var hLeft    = _el('div', 'nlg-header-left');
    hLeft.appendChild(_el('span', 'nlg-eyebrow', 'Nexus Study'));
    hLeft.appendChild(_el('span', 'nlg-title',   'Informações'));
    var closeBtn = _el('button', 'nlg-close', '\u00d7');
    closeBtn.id = 'nlg-close-btn';
    closeBtn.setAttribute('aria-label', 'Fechar Informações');
    header.appendChild(hLeft);
    header.appendChild(closeBtn);
    modal.appendChild(header);

    var _disc = document.body.dataset.disciplina || '';
    var _modo = document.body.dataset.modo       || '';
    var _sem  = window.__NEXUS_QUIZ_SEMESTRE__   || '';

    var _CODE_DISC = ['poo', 'banco_dados', 'redes'];
    var _hasCode   = _CODE_DISC.indexOf(_disc) !== -1;

    var body = _el('div', 'nlg-body');

    /* ── Bloco de modo (igual ao original) ─────────────────── */
    var _modoCfg = null;
    if      (_modo === 'enade')    _modoCfg = { icon: '🎓', label: 'Estilo ENADE',        desc: 'Questões elaboradas no formato ENADE: enunciados contextualizados, afirmativas para análise crítica e alternativas plausíveis.' };
    else if (_modo === 'ava')      _modoCfg = { icon: '📋', label: 'Questões AVA',         desc: 'Questões extraídas ou adaptadas das atividades acadêmicas, elaboradas e aplicadas pelos professores no AVA.' };
    else if (_modo === 'questoes') _modoCfg = { icon: '🤖', label: 'Geradas por IA',       desc: 'Questões didáticas que explicam o conceito antes de perguntar — ideais para revisar e consolidar o conteúdo estudado.' };
    else if (_modo === 'fixacao')  _modoCfg = { icon: '📌', label: 'Questões de Fixação',  desc: 'Questões objetivas para consolidar o conteúdo estudado — diretas, sem contextos extensos, ideais para revisão rápida.' };

    if (_modoCfg) {
      var modoBlock = _el('div', 'nlg-enade-block');
      var modoIcon  = _el('div', 'nlg-enade-icon', _modoCfg.icon);
      var modoTxt   = _el('div', 'nlg-enade-text');
      modoTxt.appendChild(_el('span', 'nlg-enade-label', _modoCfg.label));
      modoTxt.appendChild(_el('span', 'nlg-enade-desc',  _modoCfg.desc));
      modoBlock.appendChild(modoIcon);
      modoBlock.appendChild(modoTxt);
      body.appendChild(modoBlock);
      body.appendChild(_el('div', 'nlg-divider'));
    }

    /* ── Seção "Tipos de questão" ───────────────────────────── */
    var sTipos = _secao('Tipos de questão');

    if (_isSemestreEspecial(_sem)) {
      /* ════════════════════════════════════════════════════════
         SEMESTRE ESPECIAL (ex: 2026.1)
         Lê os tipos reais do window.questoes já carregado e
         renderiza com a configuração visual definida acima.
         ════════════════════════════════════════════════════════ */
      _buildTiposEspecial(sTipos.list, _sem, _modo, _tipoRow, _resolverMapaTipos(_sem));

    } else if (_modo === 'enade') {
      /* ── Tipos padrão ENADE (2026.2 em diante) ───────────── */
      sTipos.list.appendChild(_tipoRow('nlg-icon-aj',  'A+J',  'Asserção + Justificativa', 'Duas afirmativas com PORQUE'));
      sTipos.list.appendChild(_tipoRow('nlg-icon-ma',  'I–IV', 'Múltiplas afirmativas',    'Identifique as corretas'));
      sTipos.list.appendChild(_tipoRow('nlg-icon-con', 'CON',  'Conceitual',               'Contexto + pergunta direta'));
      if (_hasCode) sTipos.list.appendChild(_tipoRow('nlg-icon-cod', '</>', 'Análise de código', 'Script ou trecho — avalie afirmativas'));
      sTipos.list.appendChild(_tipoRow('nlg-icon-ap',  'APL',  'Análise aplicada',         'Situação-problema real'));

    } else if (_modo === 'fixacao') {
      /* ── Tipos padrão Fixação (2026.2 em diante) ─────────── */
      sTipos.list.appendChild(_tipoRow('nlg-icon-con', 'CUR', 'Curta',     'Pergunta direta, sem contexto ou contexto mínimo'));
      sTipos.list.appendChild(_tipoRow('nlg-icon-ma',  'DIR', 'Direta',    'Pergunta objetiva com foco no conceito'));
      sTipos.list.appendChild(_tipoRow('nlg-icon-ap',  'CTX', 'Contexto',  'Situação simples ou pequeno cenário aplicado'));
      sTipos.list.appendChild(_tipoRow('nlg-icon-aj',  'APL', 'Aplicação', 'Cenário real para interpretação e transferência'));
      if (_hasCode) sTipos.list.appendChild(_tipoRow('nlg-icon-cod', '</>', 'Código', 'Trecho de código — avalie comportamento ou saída'));

    } else if (_modo === 'ava') {
      /* ── Tipos padrão AVA (2026.2 em diante) ─────────────── */
      var avaNota = _el('div', 'nlg-enade-block');
      avaNota.style.cssText += 'flex-direction:column;gap:0.4rem;';
      var avaTopo = _el('div');
      avaTopo.style.cssText = 'display:flex;align-items:center;gap:0.5rem;';
      var avaIco  = _el('div', 'nlg-enade-icon', '📋');
      var avaTxt  = _el('div', 'nlg-enade-text');
      avaTxt.appendChild(_el('span', 'nlg-enade-label', 'Tipagem dependente da extração'));
      avaTxt.appendChild(_el('span', 'nlg-enade-desc',
        'Os tipos e a estrutura das questões refletem diretamente o conteúdo ' +
        'disponibilizado pelo professor no AVA — enunciados, atividades e ' +
        'avaliações são extraídos e adaptados sem padronização prévia de formato.'
      ));
      avaTopo.appendChild(avaIco);
      avaTopo.appendChild(avaTxt);
      avaNota.appendChild(avaTopo);
      sTipos.list.appendChild(avaNota);

    } else {
      /* ── Tipos padrão Questões (2026.2 em diante) ────────── */
      sTipos.list.appendChild(_tipoRow('nlg-icon-con', 'EXP', 'Explicativa',     'Conceito explicado antes da pergunta'));
      sTipos.list.appendChild(_tipoRow('nlg-icon-ma',  'CTX', 'Contextualizada', 'Explicação densa com múltiplos conceitos'));
      sTipos.list.appendChild(_tipoRow('nlg-icon-ap',  'APL', 'Aplicação',       'Cenário real para verificar a compreensão'));
      if (_hasCode) sTipos.list.appendChild(_tipoRow('nlg-icon-cod', '</>', 'Código', 'Trecho de código — avalie comportamento'));
    }

    body.appendChild(sTipos.wrap);
    body.appendChild(_el('div', 'nlg-divider'));

    /* ── Seção "Cores dos chips" (igual ao original) ────────── */
    var sChips = _secao('Cores dos chips');

    if (_hasCode) {
      sChips.list.appendChild(_chipRow('nlg-ddl',    'DDL / def',     'Azul — Estrutura',      'CREATE, ALTER, DROP'));
      sChips.list.appendChild(_chipRow('nlg-dml',    'DML / proc',    'Verde — Processo',      'SELECT, INSERT, UPDATE'));
      sChips.list.appendChild(_chipRow('nlg-key',    'KEY / rule',    'Âmbar — Regra',         'PRIMARY KEY, FOREIGN KEY'));
      sChips.list.appendChild(_chipRow('nlg-type',   'TYPE / term',   'Lilás — Tipo',          'VARCHAR, INTEGER, DATE'));
      sChips.list.appendChild(_chipRow('nlg-danger', 'DANGER / warn', 'Vermelho — Perigo',     'DROP TABLE, erros comuns'));
      sChips.list.appendChild(_chipRow('nlg-mark',   'MARK',          'Acento — Destaque',     'Termos sem categoria fixa'));
    } else {
      sChips.list.appendChild(_chipRow('nlg-ddl',    'def',  'Azul — Definição',      'Conceitos e estruturas formais'));
      sChips.list.appendChild(_chipRow('nlg-dml',    'proc', 'Verde — Processo',      'Ações, etapas e fluxos'));
      sChips.list.appendChild(_chipRow('nlg-key',    'rule', 'Âmbar — Regra',         'Princípios, leis e restrições'));
      sChips.list.appendChild(_chipRow('nlg-type',   'term', 'Lilás — Termo técnico', 'Classificações e tipologias'));
      sChips.list.appendChild(_chipRow('nlg-danger', 'warn', 'Vermelho — Atenção',    'Erros comuns e armadilhas'));
      sChips.list.appendChild(_chipRow('nlg-mark',   'mark', 'Acento — Destaque',     'Termos sem categoria fixa'));
    }

    body.appendChild(sChips.wrap);
    modal.appendChild(body);

    var footer = _el('div', 'nlg-footer');
    footer.appendChild(_el('div', 'nlg-footer-dot'));
    footer.appendChild(_el('span', 'nlg-footer-text', 'Chips aparecem em questões, afirmativas e feedbacks'));
    modal.appendChild(footer);
    document.body.appendChild(modal);

    function _open() {
      modal.classList.add('nlg-show');
      overlay.classList.add('nlg-show');
      var b = document.getElementById('btn-legenda');
      if (b) b.classList.add('nlg-active');
    }

    function _close() {
      modal.classList.remove('nlg-show');
      overlay.classList.remove('nlg-show');
      var b = document.getElementById('btn-legenda');
      if (b) b.classList.remove('nlg-active');
    }

    function _toggle() {
      modal.classList.contains('nlg-show') ? _close() : _open();
    }

    var btnLegenda = document.getElementById('btn-legenda');
    if (btnLegenda) btnLegenda.addEventListener('click', _toggle);
    closeBtn.addEventListener('click', _close);
    overlay.addEventListener('click', _close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') _close();
    });

  } /* fim initLegendaModal */

  /* ══════════════════════════════════════════════════════════
     EXPOSIÇÃO GLOBAL
     ══════════════════════════════════════════════════════════ */

  window.QuizUI = {
    smoothScrollTo:    smoothScrollTo,
    smoothScrollToTop: smoothScrollToTop,
    renderMarkup:      renderMarkup,
    renderCodeBlock:   renderCodeBlock,
    initLegendaModal:  initLegendaModal,
  };

})();