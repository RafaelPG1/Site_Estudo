/* =============================================
   NEXUS STUDY — quiz/disciplinas/disciplinas_init.js

   Responsabilidades (roda em todos os *.html de disciplina):
     1. Aplica as cores da disciplina via CSS variables (sem FOUC)
     2. Lê ?sem= da URL com fallback correto:
         1º) ?sem= na URL
         2º) global.js (getSemestreAtual)
         3º) fallback padrão do global.js
     3. Injeta ?sem= na URL visível via replaceState
     4. Propaga ?sem= nos links de saída (template.html / quiz.html)
     5. Filtra os cards de modo pelo semestre ativo
        (oculta cards cujo data-semestres não inclui o sem atual)
     6. Propaga ?sem= no back-btn (id="back-btn")

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

import { DISC_CORES } from '../../shared/js/cores.js';
import { resolverSemestreDeURL, sincronizarSemNaURL, propagarSemNosLinks } from '../../shared/js/url.js';
import { aplicarCoresDisciplina } from '../../shared/js/theme.js';

import { injetarLogo } from '../../shared/js/logo.js';

document.addEventListener('DOMContentLoaded', () => {
  injetarLogo({
    destino:  '#header-logo-wrap',
    tamanho:  32,
    layout:   'stacked',
    srcBase:  '../../../shared/img/logo.png',  // ajuste de caminho relativo
    linkHref: '../../../index.html',
  });
});

/* ── APLICA CORES DA DISCIPLINA (síncrono, sem FOUC) ─────── */
aplicarCoresDisciplina(
  location.pathname.split('/').pop().replace('.html', ''),
  DISC_CORES
);

/* ── SEMESTRE, LINKS E FILTRO DE MODOS ───────────────────── */
(function () {


  /* ── 3. Propaga ?sem= em todos os links de saída ─────────── */
  /*
     Cobre: cards de modo (template.html), back-btn (quiz.html).
     URL() preserva os parâmetros existentes (disc=, modo=);
     só sem= é adicionado ou sobrescrito.
  */
const sem = resolverSemestreDeURL();
sincronizarSemNaURL(sem);
propagarSemNosLinks(sem, [
  'a[href*="ava_template"]',
  'a[href*="quiz_template"]',
  'a[href*="quiz.html"]',
  'a[href*="template.html"]',
]);


  /* ── 4. Filtra cards de modo pelo semestre ativo ─────────── */
  /*
     Cada card de modo tem data-semestres="2026.1,2026.2" (ou só um).
     Se o semestre ativo não estiver na lista, o card é ocultado.
     Isso garante que AVA/Questões apareçam em 2026.1,
     enquanto ENADE e Fixação ficam visíveis apenas em 2026.2.
  */
  document.querySelectorAll('[data-semestres]').forEach(function (card) {
    var semestresDoCard = card.dataset.semestres
      .split(',')
      .map(function (s) { return s.trim(); });

    if (semestresDoCard.indexOf(sem) === -1) {
      card.style.display = 'none';
    }
  });

})();