/* ============================================================
   NEXUS STUDY — quiz/disciplinas/disciplinas_init.js

   Responsabilidades (roda em todos os *.html de disciplina):
     1. Aplica as cores da disciplina via CSS variables (sem FOUC)
     2. Lê ?sem= da URL (fallback: '2026.2')
     3. Injeta ?sem= na URL visível via replaceState
     4. Propaga ?sem= nos links de saída (ava_template / quiz_template)
     5. Propaga ?sem= no back-btn (id="back-btn")
        → O href já tem ?sem=2026.2 como fallback no HTML estático.
          Aqui sobrescrevemos com o valor real da URL.

   ROBUSTEZ:
     - Usa URL() para manipular hrefs → nunca corrompe query strings
       existentes nem duplica parâmetros.
     - Fallback explícito '2026.2' garante funcionamento mesmo se
       ?sem= não vier na URL (acesso direto ao arquivo, por ex.).
     - Cobertura ampla: apanha todos os links que contenham
       'ava_template', 'quiz_template' OU 'quiz.html' — inclui
       tanto os cards de modo quanto o back-btn.
     - replaceState só é chamado quando necessário (evita entrada
       extra no histórico do navegador).

   ATENÇÃO: este arquivo usa import, portanto o <script> nos HTMLs
   de disciplina deve ter type="module":
     <script type="module" src="../disciplinas_init.js"></script>
   ============================================================ */

import { DISC_CORES } from './disciplinas_cores.js';

/* ── APLICA CORES DA DISCIPLINA (síncrono, sem FOUC) ─────── */
/*
   Lê o id da disciplina pelo nome do arquivo HTML atual
   (ex: "redes.html" → "redes") e aplica as variáveis CSS
   diretamente no :root, substituindo os arquivos CSS individuais.
*/
(function aplicarCores() {
  var discId = location.pathname.split('/').pop().replace('.html', '');
  var cores  = DISC_CORES[discId];

  if (cores) {
    var root = document.documentElement;
    root.style.setProperty('--cor-tema',       cores.corTema);
    root.style.setProperty('--cor-tema-rgb',   cores.corTemaRgb);
    root.style.setProperty('--cor-tema-2',     cores.corTema2);
    root.style.setProperty('--cor-tema-2-rgb', cores.corTema2Rgb);
  } else {
    console.warn('[disciplinas_init] Sem cores definidas para: ' + discId);
  }
})();

/* ── SEMESTRE E LINKS ─────────────────────────────────────── */
(function () {
  var sem = new URLSearchParams(location.search).get('sem') || '2026.2';

  /* 1 — Garante que ?sem= apareça na barra de endereço ---------- */
  if (!location.search.includes('sem=')) {
    var current = new URL(location.href);
    current.searchParams.set('sem', sem);
    history.replaceState(null, '', current.toString());
  }

  /* 2 — Propaga ?sem= em todos os links de saída relevantes ----- */
  /*
     Seletor intencional: apanha tanto os cards de modo
     (ava_template, quiz_template) quanto o back-btn (quiz.html).
     Usar URL() garante que parâmetros já presentes no HTML
     (disc=, modo=) sejam preservados — apenas sem= é adicionado
     ou atualizado.
  */
  var seletores = [
    'a[href*="ava_template"]',
    'a[href*="quiz_template"]',
    'a[href*="quiz.html"]',
    'a[href*="template.html"]',
  ];

  document.querySelectorAll(seletores.join(', ')).forEach(function (a) {
    try {
      var url = new URL(a.href, location.href);
      url.searchParams.set('sem', sem);
      a.href = url.toString();
    } catch (e) {
      /* href inválido — ignora silenciosamente */
    }
  });
})();