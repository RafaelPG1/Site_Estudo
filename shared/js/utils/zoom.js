/* ============================================================
   NEXUS STUDY — shared/js/utils/zoom.js  (v2.1)
   ============================================================ */


// ═══ ZOOM PADRÃO DA PÁGINA (80%) ═════════════════════════════
//
// Aplicado via CSS `zoom` (Chrome, Edge, Opera e outros navegadores
// baseados em Chromium). Executa quando o script é carregado e define
// o zoom inicial da página para 80%.
//
// Se o usuário alterar o zoom manualmente depois (Ctrl + / Ctrl -),
// este código não interfere novamente.
//

(() => {
    const ZOOM_PADRAO = 80; // %

    // Como não existe uma API confiável para obter o zoom real do
    // navegador, assume-se que a página inicia em 100%.
    let zoomAtual = 100;

    if (zoomAtual > ZOOM_PADRAO) {
        zoomAtual = ZOOM_PADRAO;
    }

    document.documentElement.style.zoom = `${zoomAtual}%`;
})();