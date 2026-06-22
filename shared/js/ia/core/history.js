/**
 * NEXUS — shared/js/ia/core/history.js
 *
 * Gerenciador de histórico de chat isolado por chave de contexto.
 *
 * Cada combinação de (domínio + disciplina + semestre + modo) produz uma
 * chave única. Históricos de contextos diferentes nunca se misturam.
 *
 * ── v1.1 — PERSISTÊNCIA REAL NO F5 ───────────────────────────
 *   Antes usava sessionStorage. sessionStorage por si só já sobrevive
 *   a F5, mas o quiz/js/assistant.js limpava o domínio inteiro no
 *   evento 'pagehide' — e 'pagehide' também dispara em reload, não
 *   apenas ao fechar a aba. Resultado: o histórico era apagado bem
 *   antes do reload terminar, parecendo "resetar no F5".
 *
 *   Trocado para localStorage, que é mais explícito sobre a intenção
 *   (persistir entre sessões da aba) e não depende de nenhum
 *   comportamento de ciclo de vida de página para "sobreviver".
 *   A responsabilidade de LIMPAR ao trocar de disciplina/modo agora
 *   é tratada de forma intencional pelo assistant.js (comparando o
 *   contexto salvo vs. o contexto atual), não por um listener de
 *   ciclo de vida que dispara em momentos imprevisíveis.
 *
 * ── v1.2 — ÁRVORE DE CONVERSA ─────────────────────────────────
 *   Mensagens de usuário editáveis agora podem trazer msg.tree, uma
 *   árvore de versões (ver assistant.js). Cada nó da árvore tem um
 *   campo node.ramo[] com mensagens completas (clones), que por sua
 *   vez também podem conter mensagens de usuário com seu próprio
 *   msg.tree — a estrutura é recursiva.
 *
 *   __idx é um campo de runtime (recalculado a cada render) que NÃO
 *   deve ir para o storage. Antes disso só precisava ser removido no
 *   nível superior de `mensagens`; agora _removerIdxRecursivo() varre
 *   também dentro de qualquer node.ramo[] encontrado, em qualquer
 *   profundidade, para manter o JSON persistido limpo.
 *
 *   O FORMATO de storage não mudou: continua sendo o array de
 *   mensagens (state.messages) serializado como JSON. msg.tree viaja
 *   dentro do objeto da própria mensagem, então históricos antigos
 *   (sem tree, com versions[]) continuam sendo lidos normalmente —
 *   a migração para tree acontece no assistant.js, não aqui.
 *
 * ── v1.3 — FALHA DE PERSISTÊNCIA NÃO É MAIS SILENCIOSA ─────────
 *   Bug confirmado: quando store.setItem() estourava a cota do
 *   localStorage (ex.: árvore de versões muito profunda acumulando
 *   ramos), o erro era engolido por um catch (_) {} vazio. O usuário
 *   podia perder parte do histórico/árvore entre uma sessão e outra
 *   sem nenhum indício de que algo deu errado.
 *
 *   CORREÇÃO: o catch de salvar() agora registra um console.warn com
 *   a chave do histórico e a quantidade de mensagens envolvidas, para
 *   que a falha apareça no console em vez de desaparecer em silêncio.
 *   O comportamento de não travar a aplicação foi mantido — a falha
 *   continua não-fatal, só deixou de ser muda. Os demais catches deste
 *   arquivo (carregar/limpar/limparDominio/_store) não foram alterados
 *   — não fazem parte do bug confirmado.
 *
 * API pública: window.NexusHistory
 *
 * Depende de: (nenhuma)
 */

(function () {
  'use strict';

  var MAX_MESSAGES   = 20;
  var STORAGE_PREFIX = 'nexus_chat_';

  /* ══════════════════════════════════════════════════════════
     CHAVE DE CONTEXTO
  ══════════════════════════════════════════════════════════ */

  /**
   * Monta chave estável para um contexto.
   * Ex: "resumo|design|2026.1-ap1"
   *     "quiz|redes|2026.1-ap2"
   *
   * @param {string} dominio  — 'resumo' | 'quiz' | 'games'
   * @param {string} discId   — id da disciplina (ex: 'design', 'redes')
   * @param {string} sem      — semestre (ex: '2026.1-AP1')
   * @returns {string}
   */
  function montarChave(dominio, discId, sem) {
    return [
      (dominio || '').toLowerCase(),
      (discId  || '').toLowerCase(),
      (sem     || '').toLowerCase(),
    ].join('|');
  }

  function _storageKey(chave) {
    return STORAGE_PREFIX + chave;
  }

  /* ══════════════════════════════════════════════════════════
     ACESSO SEGURO AO localStorage

     Algumas situações (modo privado restrito, cota excedida,
     ambiente sem storage) podem lançar exceção. Todas as operações
     já eram protegidas por try/catch — mantido igual.
  ══════════════════════════════════════════════════════════ */

  function _store() {
    try {
      return window.localStorage || null;
    } catch (_) {
      return null;
    }
  }

  /* ══════════════════════════════════════════════════════════
     LIMPEZA RECURSIVA DE __idx

     __idx só faz sentido para a UI no instante da renderização do
     array visível (state.messages). Dentro de msg.tree.nodes[*].ramo[*]
     ele é apenas lixo herdado do clone — removido recursivamente para
     manter o JSON persistido limpo e previsível.
  ══════════════════════════════════════════════════════════ */

  function _removerIdxRecursivo(msg) {
    if (!msg || typeof msg !== 'object') return msg;
    var copia = Object.assign({}, msg);
    if ('__idx' in copia) delete copia.__idx;

    if (copia.tree && copia.tree.nodes) {
      var nodesCopia = {};
      Object.keys(copia.tree.nodes).forEach(function (nodeId) {
        var node = copia.tree.nodes[nodeId];
        var nodeCopia = Object.assign({}, node);
        if (Array.isArray(node.ramo)) {
          nodeCopia.ramo = node.ramo.map(_removerIdxRecursivo);
        }
        nodesCopia[nodeId] = nodeCopia;
      });
      copia.tree = Object.assign({}, copia.tree, { nodes: nodesCopia });
    }

    return copia;
  }

  /* ══════════════════════════════════════════════════════════
     LEITURA / ESCRITA
  ══════════════════════════════════════════════════════════ */

  /**
   * Carrega mensagens salvas para a chave.
   * Retorna [] se não houver histórico ou se falhar.
   *
   * @param {string} chave
   * @returns {object[]}
   */
  function carregar(chave) {
    if (!chave) return [];
    var store = _store();
    if (!store) return [];
    try {
      var raw = store.getItem(_storageKey(chave));
      if (!raw) return [];
      var msgs = JSON.parse(raw);
      return Array.isArray(msgs) ? msgs : [];
    } catch (_) { return []; }
  }

  /**
   * Salva mensagens para a chave.
   * Aplica limite de MAX_MESSAGES, preservando a msg de sistema (role:'system').
   *
   * @param {string}   chave
   * @param {object[]} mensagens
   */
  function salvar(chave, mensagens) {
    if (!chave || !Array.isArray(mensagens)) return;
    var store = _store();
    if (!store) return;
    try {
      var sistemaIdx = mensagens.findIndex(function (m) { return m.role === 'system'; });
      var sistema    = sistemaIdx !== -1 ? mensagens[sistemaIdx] : null;
      var resto      = mensagens.filter(function (m) { return m.role !== 'system'; });

      if (resto.length > MAX_MESSAGES - 1) {
        resto = resto.slice(-(MAX_MESSAGES - 1));
      }

      var final = sistema ? [sistema].concat(resto) : resto;

      // __idx é um campo de runtime (posição no array, usado pela UI
      // para os botões de editar/versão) — recalculado a cada render,
      // nunca precisa ir para o storage. Removido recursivamente para
      // também limpar dentro de qualquer msg.tree.nodes[*].ramo[*].
      var paraSalvar = final.map(_removerIdxRecursivo);

      store.setItem(_storageKey(chave), JSON.stringify(paraSalvar));
    } catch (err) {
      // v1.3 — antes a falha (ex.: QuotaExceededError ao estourar a
      // cota do localStorage) era engolida em silêncio, e o usuário
      // podia perder parte da árvore sem nenhum indício. O
      // comportamento de não quebrar a aplicação foi mantido — a
      // falha só deixou de ser muda.
      console.warn(
        '[NexusHistory] falha ao salvar histórico (chave: ' + chave +
        ', mensagens: ' + mensagens.length + '):', err
      );
    }
  }

  /**
   * Apaga o histórico da chave.
   *
   * @param {string} chave
   */
  function limpar(chave) {
    if (!chave) return;
    var store = _store();
    if (!store) return;
    try { store.removeItem(_storageKey(chave)); } catch (_) {}
  }

  /**
   * Apaga todos os históricos cujo domínio corresponda ao prefixo.
   * Útil para limpar tudo de um domínio quando o contexto muda de
   * verdade (ex: trocou de disciplina ou de modo no quiz).
   *
   * @param {string} dominio — 'resumo' | 'quiz' | 'games'
   */
  function limparDominio(dominio) {
    if (!dominio) return;
    var store = _store();
    if (!store) return;
    try {
      var prefix = STORAGE_PREFIX + dominio.toLowerCase() + '|';
      var keys = [];
      for (var i = 0; i < store.length; i++) {
        var k = store.key(i);
        if (k && k.indexOf(prefix) === 0) keys.push(k);
      }
      keys.forEach(function (k) { store.removeItem(k); });
    } catch (_) {}
  }

  /* ══════════════════════════════════════════════════════════
     API PÚBLICA
  ══════════════════════════════════════════════════════════ */

  window.NexusHistory = {
    montarChave,
    carregar,
    salvar,
    limpar,
    limparDominio,
  };

}());