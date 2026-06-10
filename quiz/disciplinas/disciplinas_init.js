// @ts-nocheck
/* ============================================================
   NEXUS STUDY — quiz/disciplinas/disciplinas_init.js  v5.0

   ARQUITETURA DESTA VERSÃO
   ────────────────────────────────────────────────────────────
   PRINCÍPIO ÚNICO:
     Os cards existem no HTML. Eles já estão visíveis.
     Este arquivo NUNCA decide se um card existe.
     Este arquivo NUNCA esconde um card.
     Este arquivo NUNCA bloqueia a exibição de um card.

   RESPONSABILIDADES (por ordem de prioridade):
     1. Propagar ?sem= nos hrefs dos cards         (crítico)
     2. Exibir o badge de semestre no header       (visual)
     3. Aplicar cores da disciplina               (visual)
     4. Inicializar áudio e logo                  (UX)
     5. Carregar arquivo de questões em background (opcional)

   GARANTIAS:
     - Cada responsabilidade está isolada em seu próprio
       try/catch. Uma falha em qualquer etapa NÃO afeta
       as outras etapas e NÃO afeta os cards.
     - O carregamento das questões (etapa 5) é assíncrono
       e não bloqueia nada. Se o arquivo não existir, os
       cards continuam visíveis e funcionais.
     - Não há nenhuma condição que possa resultar em
       display:none, visibility:hidden, opacity:0 ou
       remoção de qualquer card do DOM.
   ============================================================ */

/* ──────────────────────────────────────────────────────────
   IMPORTS
   ────────────────────────────────────────────────────────── */
import { DISC_CORES } from '../../shared/js/themes/cores.js';
import {
  resolverSemestreDeURL,
  sincronizarSemNaURL,
  propagarSemNosLinks,
} from '../../shared/js/utils/url.js';
import { aplicarCoresDisciplina } from '../../shared/js/themes/theme.js';
import { injetarLogo }             from '../../shared/js/utils/logo.js';
import {
  Sound,
  audio,
  installAudioRecovery,
  playSound,
} from '../../shared/js/audio/audio-api.js';


/* ──────────────────────────────────────────────────────────
   ASSISTENTE NEXUS (carregamento em background, sem impacto)
   ────────────────────────────────────────────────────────── */
(function _carregarIA() {
  try {
    var raiz = new URL('../../', import.meta.url).href.replace(/\/$/, '');

    function _loadScript(src) {
      return new Promise(function (resolve, reject) {
        var s    = document.createElement('script');
        s.src    = src;
        s.onload = resolve;
        s.onerror = function () {
          reject(new Error('[Nexus IA] Falha: ' + src));
        };
        document.body.appendChild(s);
      });
    }

    Promise.all([
      _loadScript(raiz + '/shared/js/ia/ia-ui.js'),
      _loadScript(raiz + '/shared/js/ia/ia-search.js'),
      _loadScript(raiz + '/shared/js/ia/ia-loader.js'),
      _loadScript(raiz + '/shared/js/ia/ia-worker.js'),
    ])
      .then(function () { return _loadScript(raiz + '/shared/js/ia/ia.js'); })
      .catch(function (err) { console.warn('[disciplinas_init] IA não carregada:', err.message); });
  } catch (e) {
    /* IA não é essencial — falha silenciosamente */
  }
}());

/* ──────────────────────────────────────────────────────────
   ETAPA 0 — Resolver o ID da disciplina a partir da URL
   ────────────────────────────────────────────────────────── */
var _discId = 'desconhecida';
try {
  _discId = location.pathname.split('/').pop().replace('.html', '') || 'desconhecida';
} catch (e) {
  console.warn('[disciplinas_init] Não foi possível ler o discId da URL:', e.message);
}

/* ──────────────────────────────────────────────────────────
   ETAPA 1 — Aplicar cores da disciplina (síncrono, sem FOUC)
   Isolado: se a disciplina não tiver cores cadastradas,
   o sistema continua sem cores personalizadas — sem crash.
   ────────────────────────────────────────────────────────── */
try {
  if (DISC_CORES && DISC_CORES[_discId]) {
    aplicarCoresDisciplina(_discId, DISC_CORES);
  } else {
    console.info(
      '[disciplinas_init] Cores não definidas para "' + _discId + '". ' +
      'Usando tema padrão.'
    );
  }
} catch (e) {
  console.warn('[disciplinas_init] Erro ao aplicar cores:', e.message);
  /* Cards continuam visíveis com o tema padrão */
}

/* ──────────────────────────────────────────────────────────
   ETAPA 2 — Resolver semestre e propagar nos cards

   ORDEM DE PRIORIDADE (da mais confiável para a menos):
     1. URLSearchParams direta  — fonte da verdade, nunca valida
     2. resolverSemestreDeURL() — pode rejeitar formatos como
        "2026.1-ap2" se não estiver em SEMESTRES[]
     3. String vazia            — pior caso; cards ainda aparecem

   POR QUÊ URLSearchParams PRIMEIRO:
     resolverSemestreDeURL() valida o semestre contra a lista
     global SEMESTRES[]. Semestres com AP (ex: "2026.1-ap2")
     podem não estar nessa lista, fazendo a função retornar
     vazio mesmo quando a URL tem o valor correto.
     Lendo direto da URL garantimos que "2026.1-ap2" sempre
     seja preservado e propagado.
   ────────────────────────────────────────────────────────── */
var _sem = '';

/* 1ª tentativa: leitura direta da URL — nunca valida, nunca rejeita */
try {
  var _rawSem = new URLSearchParams(location.search).get('sem') || '';
  /* Normaliza o casing do AP: "2026.1-ap2" → "2026.1-AP2".
     SEMESTRES[] e os diretórios físicos usam maiúsculas.
     parseSemestre() preserva o casing recebido — sem
     normalização aqui, o caminho gerado seria .../ap2/ques_*.js
     que não existe em servidores Linux (case-sensitive). */
  _sem = _rawSem.replace(/-(.+)$/, function(_, ap) { return '-' + ap.toUpperCase(); });
} catch (e) { /* ignora — browser muito antigo */ }

/* 2ª tentativa: se a URL não tinha ?sem=, tenta a função utilitária */
if (!_sem) {
  try {
    _sem = resolverSemestreDeURL() || '';
  } catch (e) {
    console.warn('[disciplinas_init] resolverSemestreDeURL falhou:', e.message);
  }
}

/* Sincroniza na URL (não crítico) */
try {
  if (_sem) sincronizarSemNaURL(_sem);
} catch (e) { /* ignora */ }

/*
   Propaga ?sem= nos hrefs dos 4 cards.
   Os seletores cobrem os padrões usados em banco_dados.html,
   poo.html, redes.html e design.html.
   NUNCA esconde cards — apenas atualiza o href.
*/
try {
  propagarSemNosLinks(_sem, [
    'a[href*="template.html"]',
    'a[href*="ava_template"]',
    'a[href*="quiz_template"]',
    'a[href*="quiz.html"]',
    '.disc-card[href]',
  ]);
} catch (e) {
  console.warn('[disciplinas_init] propagarSemNosLinks falhou — aplicando fallback manual:', e.message);
}

/*
   Fallback manual: garante que TODOS os links .disc-card
   tenham ?sem= correto, independente de propagarSemNosLinks.
   Cobre o caso de "2026.1-ap2" ser rejeitado pela função
   utilitária mas estar correto na URL.
*/
if (_sem) {
  try {
    document.querySelectorAll('a.disc-card, a[href*="template.html"]').forEach(function (link) {
      try {
        var url = new URL(link.href, location.href);
        url.searchParams.set('sem', _sem);
        link.href = url.toString();
      } catch (e2) { /* link inválido — ignora */ }
    });
  } catch (e) { /* ignora */ }
}

/* Atualiza o badge de semestre no header */
try {
  var _badge = document.getElementById('header-sem-badge');
  if (_badge) {
    _badge.textContent = _sem || '—';
  }
} catch (e) { /* ignora */ }



/* ──────────────────────────────────────────────────────────
   ETAPA 4 — Áudio, logo e eventos de hover/click nos cards
   Tudo dentro de DOMContentLoaded para garantir que o DOM
   esteja completo. Cada bloco é independente.
   ────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function _onDomReady() {

  /* ── Logo ── */
  try {
    injetarLogo('#header-logo-wrap');
  } catch (e) {
    console.warn('[disciplinas_init] injetarLogo falhou:', e.message);
  }

  /* ── Áudio ── */
  try {
    Sound.init();
    installAudioRecovery({ Sound, audio });
  } catch (e) {
    console.warn('[disciplinas_init] Sound.init falhou:', e.message);
  }

  /* ── Eventos nos cards (não bloqueiam a aparição dos cards) ── */
  try {
    var backBtn = document.getElementById('back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', function () {
        try { playSound('click', 'quiz'); } catch (e) {}
      });
    }

    document.querySelectorAll('.disc-card').forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        try { playSound('hover', 'quiz'); } catch (e) {}
      });
      card.addEventListener('click', function () {
        try { playSound('click', 'quiz'); } catch (e) {}
      });
    });
  } catch (e) {
    /* Eventos são UX extra — falha silenciosa */
  }

  /* ── Aguarda áudio estar pronto (não bloqueia nada) ── */
  try {
    Sound.waitUntilReady().catch(function () { /* ignora */ });
  } catch (e) { /* ignora */ }

});