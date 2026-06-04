/**
 * ASSISTENTE NEXUS — ia-search.js
 * Motor de busca interno. Zero DOM. Zero renderização.
 *
 * Responsabilidades:
 *   - Receber contexto (semestre/disciplina) via NexusSearch.setContexto()
 *   - Carregar dinamicamente o res_*.js correto
 *   - Indexar conteúdo em memória
 *   - Executar busca e retornar resultados ranqueados
 *
 * NÃO faz: DOM, renderização, botões, cards, modais.
 * API pública: window.NexusSearch
 */

(function () {
  'use strict';

  /* ── ÍNDICE INTERNO ──────────────────────────────────────────
   * Cada entrada:
   * {
   *   texto:    string  — trecho indexado
   *   aula:     string  — nome da aula de origem
   *   secao:    string  — título da seção de origem
   *   peso:     number  — fator de importância (ideia_central > texto)
   * }
   * ─────────────────────────────────────────────────────────── */
  let _indice = [];

  /* ── CONTEXTO ATUAL ─────────────────────────────────────────
   * Preenchido por setContexto() antes de qualquer busca.
   * {
   *   ano:      string  — ex: '2026'
   *   periodo:  string  — ex: '2026.1'
   *   ap:       string  — ex: 'AP1'
   *   arquivo:  string  — ex: 'redes'
   * }
   * ─────────────────────────────────────────────────────────── */
  let _contexto = null;

  /* ── FLAG DE CARREGAMENTO ────────────────────────────────────
   * Evita carregar o mesmo arquivo duas vezes.
   * ─────────────────────────────────────────────────────────── */
  let _arquivoCarregado = null;

  /* ══════════════════════════════════════════════════════════
     NORMALIZAÇÃO
     ══════════════════════════════════════════════════════════ */

  /**
   * Normaliza texto para busca:
   *   - minúsculo
   *   - remove acentos (NFD)
   *   - colapsa espaços
   * @param {string} texto
   * @returns {string}
   */
  function normalizarTexto(texto) {
    if (typeof texto !== 'string') return '';
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s\/\-\.]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* ══════════════════════════════════════════════════════════
     INDEXAÇÃO
     ══════════════════════════════════════════════════════════ */

  /**
   * Extrai texto de um bloco conforme seu tipo.
   * Retorna array de strings (um bloco pode gerar múltiplos trechos).
   * @param {object} bloco
   * @returns {string[]}
   */
  function _extrairBloco(bloco) {
    if (!bloco || !bloco.tipo) return [];
    const textos = [];

    switch (bloco.tipo) {
      case 'texto':
      case 'destaque':
        if (bloco.texto) textos.push(bloco.texto);
        break;

      case 'topico':
        if (bloco.titulo) textos.push(bloco.titulo);
        if (bloco.texto)  textos.push(bloco.texto);
        break;

      case 'lista':
        if (bloco.titulo) textos.push(bloco.titulo);
        if (Array.isArray(bloco.itens)) {
          // Junta itens em um trecho único para manter contexto na busca
          textos.push(bloco.itens.join(' · '));
        }
        break;

      case 'exemplo':
        if (bloco.titulo)  textos.push(bloco.titulo);
        if (bloco.texto)   textos.push(bloco.texto);
        if (bloco.detalhe) textos.push(bloco.detalhe);
        break;

      // Tipos visuais — ignorados intencionalmente
      // 'imagem', 'tabela', 'codigo', etc.
      default:
        break;
    }

    return textos;
  }

  /**
   * Indexa um objeto __nexusConteudo completo em memória.
   * Limpa o índice anterior antes de indexar.
   * @param {object} conteudo — window.__nexusConteudo
   */
  function indexarConteudo(conteudo) {
    _indice = [];

    if (!conteudo || !Array.isArray(conteudo.aulas)) {
      console.warn('[NexusSearch] indexarConteudo: conteúdo inválido ou sem aulas.');
      return;
    }

    conteudo.aulas.forEach(function (aula) {
      const nomeAula = aula.aula || '';

      // ideia_central — peso maior (resumo da aula)
      if (aula.ideia_central) {
        _indice.push({
          texto:  aula.ideia_central,
          aula:   nomeAula,
          secao:  'Ideia Central',
          peso:   1.5,
        });
      }

      // Seções e blocos
      if (Array.isArray(aula.secoes)) {
        aula.secoes.forEach(function (secao) {
          const tituloSecao = secao.titulo || '';

          // Título da seção como trecho próprio
          if (tituloSecao) {
            _indice.push({
              texto:  tituloSecao,
              aula:   nomeAula,
              secao:  tituloSecao,
              peso:   1.2,
            });
          }

          if (Array.isArray(secao.blocos)) {
            secao.blocos.forEach(function (bloco) {
              const trechos = _extrairBloco(bloco);
              trechos.forEach(function (trecho) {
                if (trecho && trecho.trim()) {
                  _indice.push({
                    texto:  trecho.trim(),
                    aula:   nomeAula,
                    secao:  tituloSecao,
                    peso:   1.0,
                  });
                }
              });
            });
          }
        });
      }
    });

    console.log('[NexusSearch] indexado:', _indice.length, 'trechos de', conteudo.aulas.length, 'aulas.');
  }

  /* ══════════════════════════════════════════════════════════
     SCORE
     ══════════════════════════════════════════════════════════ */

  /**
   * Calcula relevância de um trecho para a query.
   * @param {string} queryNorm
   * @param {string} textoNorm
   * @param {number} peso
   * @returns {number} score 0–100
   */
  function _score(queryNorm, textoNorm, peso) {
    if (!queryNorm || !textoNorm) return 0;

    const termos = queryNorm.split(' ').filter(Boolean);
    if (!termos.length) return 0;

    let acertos = 0;
    termos.forEach(function (t) {
      if (textoNorm.includes(t)) acertos++;
    });

    const cobertura = acertos / termos.length;
    const bonus     = textoNorm.includes(queryNorm) ? 0.3 : 0;

    return Math.min(100, Math.round((cobertura + bonus) * peso * 100));
  }

  /* ══════════════════════════════════════════════════════════
     BUSCA
     ══════════════════════════════════════════════════════════ */

  /**
   * Executa busca no índice atual.
   * @param {string} pergunta
   * @param {{ topK?: number, minScore?: number }} [opcoes]
   * @returns {Array<{ score: number, texto: string, aula: string }>}
   */
  function buscar(pergunta, opcoes) {
    const topK     = (opcoes && opcoes.topK)      || 3;
    const minScore = (opcoes && opcoes.minScore != null) ? opcoes.minScore : 10;

    const queryNorm = normalizarTexto(pergunta);
    if (!queryNorm || !_indice.length) return [];

    const resultados = [];

    _indice.forEach(function (entrada) {
      const textoNorm = normalizarTexto(entrada.texto);
      const s = _score(queryNorm, textoNorm, entrada.peso);
      if (s >= minScore) {
        resultados.push({
          score: s,
          texto: entrada.texto,
          aula:  entrada.aula,
          secao: entrada.secao,
        });
      }
    });

    resultados.sort(function (a, b) { return b.score - a.score; });
    return resultados.slice(0, topK);
  }

  /* ══════════════════════════════════════════════════════════
     CARREGAMENTO DINÂMICO
     ══════════════════════════════════════════════════════════ */

  /**
   * Monta o path do arquivo de conteúdo a partir do contexto.
   * Padrão: content/resumo/{ano}/{periodo}/{ap}/res_{arquivo}.js
   *
   * Se não houver AP (semestres futuros sem AP), omite a pasta.
   * @param {{ ano, periodo, ap, arquivo }} ctx
   * @returns {string}
   */
  function _montarPath(ctx) {
    const base = '/content/resumo/' + ctx.ano + '/' + ctx.periodo;
    if (ctx.ap) {
      return base + '/' + ctx.ap + '/res_' + ctx.arquivo + '.js';
    }
    return base + '/res_' + ctx.arquivo + '.js';
  }

  /**
   * Carrega dinamicamente o res_*.js via <script> e indexa o conteúdo.
   * Resolve com true em sucesso, false em falha.
   * @param {object} ctx
   * @returns {Promise<boolean>}
   */
  function _carregarScript(ctx) {
    return new Promise(function (resolve) {
      const path = _montarPath(ctx);

      // Evita recarregar o mesmo arquivo
      if (_arquivoCarregado === path) {
        console.log('[NexusSearch] arquivo já carregado:', path);
        resolve(true);
        return;
      }

      // Remove script anterior se existir
      const anterior = document.getElementById('nexus-conteudo-script');
      if (anterior) anterior.remove();

      // Limpa a variável global antes de carregar
      window.__nexusConteudo = undefined;

      const s = document.createElement('script');
      s.id  = 'nexus-conteudo-script';
      s.src = path;

      s.onload = function () {
        if (window.__nexusConteudo) {
          indexarConteudo(window.__nexusConteudo);
          _arquivoCarregado = path;
          resolve(true);
        } else {
          console.warn('[NexusSearch] script carregado mas __nexusConteudo não encontrado:', path);
          resolve(false);
        }
      };

      s.onerror = function () {
        console.warn('[NexusSearch] falha ao carregar:', path);
        resolve(false);
      };

      document.body.appendChild(s);
    });
  }

  /* ══════════════════════════════════════════════════════════
     CONTEXTO
     ══════════════════════════════════════════════════════════ */

  /**
   * Define o contexto atual (semestre + disciplina).
   * Chamado por ia.js antes de qualquer busca.
   * @param {{ ano, periodo, ap, arquivo }} ctx
   */
  function setContexto(ctx) {
    _contexto = ctx;
    // Reseta flag para permitir recarregar se disciplina mudou
    const novoPath = _montarPath(ctx);
    if (_arquivoCarregado !== novoPath) {
      _indice = [];
      _arquivoCarregado = null;
    }
  }

  /**
   * Garante que o conteúdo do contexto atual está carregado e indexado.
   * Usa __nexusConteudo se já existir na página (páginas de resumo),
   * senão carrega dinamicamente o res_*.js.
   * @returns {Promise<boolean>}
   */
  function garantirConteudo() {
    // Já indexado
    if (_indice.length > 0) return Promise.resolve(true);

    // Conteúdo já presente na página (ex: página de resumo)
    if (window.__nexusConteudo) {
      indexarConteudo(window.__nexusConteudo);
      return Promise.resolve(true);
    }

    // Precisa de contexto para carregar dinamicamente
    if (!_contexto) {
      console.warn('[NexusSearch] garantirConteudo: contexto não definido.');
      return Promise.resolve(false);
    }

    return _carregarScript(_contexto);
  }

  /* ══════════════════════════════════════════════════════════
     API PÚBLICA
     ══════════════════════════════════════════════════════════ */
  window.NexusSearch = {
    setContexto,
    garantirConteudo,
    indexarConteudo,
    buscar,
    normalizarTexto,

    // Debug
    _getIndice:   function () { return _indice; },
    _getContexto: function () { return _contexto; },
  };

}());