/* ============================================================
  NEXUS STUDY — quiz/disciplinas/disciplinas_init.js

  Responsabilidades (roda em todos os *.html de disciplina):
    1. Aplica as cores da disciplina via CSS variables (sem FOUC)
    2. Lê ?sem= da URL com fallback correto:
        1º) ?sem= na URL
        2º) global.js (getSemestreAtual)
        3º) fallback padrão do global.js
    3. Injeta ?sem= na URL visível via replaceState
    4. Propaga ?sem= nos links de saída (template.html / quiz.html)
    5. Propaga ?sem= no back-btn (id="back-btn")

  Lógica do semestre:
    - O valor do semestre é resolvido respeitando a prioridade:
        a) parâmetro ?sem= presente na URL
        b) função getSemestreAtual (definida no global.js)
        c) valor padrão definido no global.js

  Padrões e robustez:
    - Uso de URL() para manipulação segura de links
    - Preserva outros parâmetros (disc=, modo=, etc.)
    - replaceState executa apenas se ?sem= não existir na URL
    - Compatível com acesso direto via link (deep link)

  Organização:
    - Toda lógica de estado global fica centralizada no global.js
    - Evita acesso direto ao localStorage neste arquivo
    - Mantém consistência de navegação entre páginas

  ============================================================ */
  
import { DISC_CORES } from './disciplinas_cores.js';
import { getSemestreAtual } from '../../global.js'; 

/* ── APLICA CORES DA DISCIPLINA (síncrono, sem FOUC) ─────── */
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

  /* ── 1. Determinar semestre ────────────────────────────────
     Prioridade:
       a) ?sem= na URL  (propagado pelo quiz.html ao clicar no card)
       b) localStorage  (nexus_semestre_atual, salvo por global.js)
       c) '2026.2'      (último fallback — acesso direto ao arquivo)
  ─────────────────────────────────────────────────────────── */
var sem = new URLSearchParams(location.search).get('sem')
       || getSemestreAtual();

  /* ── 2. Garante que ?sem= apareça na barra de endereço ──── */
  if (!location.search.includes('sem=')) {
    var current = new URL(location.href);
    current.searchParams.set('sem', sem);
    history.replaceState(null, '', current.toString());
  }

  /* ── 3. Propaga ?sem= em todos os links de saída ─────────── */
  /*
     Cobre: cards de modo (template.html), back-btn (quiz.html).
     URL() preserva os parâmetros existentes (disc=, modo=);
     só sem= é adicionado ou sobrescrito.
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
    } catch (e) { /* href inválido — ignora */ }
  });

})();