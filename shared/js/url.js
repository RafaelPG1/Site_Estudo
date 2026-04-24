/* ============================================================
   NEXUS STUDY — shared/url.js
   Utilitários de URL e semestre compartilhados entre páginas.

   Funções:
     resolverSemestreDeURL()          → lê ?sem= com fallback
     sincronizarSemNaURL(sem, modo)   → injeta/atualiza ?sem=
     propagarSemNosLinks(sem, sels)   → propaga ?sem= em links
   ============================================================ */

import { getSemestreAtual } from '../../src/global.js';

/* ─────────────────────────────────────────────────────────────
   resolverSemestreDeURL
   Resolve o semestre ativo com prioridade:
     1º) ?sem= na URL atual
     2º) getSemestreAtual() — valor salvo no storage
     3º) fallback automático do global.js (SEMESTRES[0])
───────────────────────────────────────────────────────────── */
export function resolverSemestreDeURL() {
  return new URLSearchParams(location.search).get('sem')
      || getSemestreAtual();
}

/* ─────────────────────────────────────────────────────────────
   sincronizarSemNaURL
   Injeta ou atualiza o parâmetro ?sem= na URL sem recarregar.

   @param {string} sem           — ex: '2026.1'
   @param {'replace'|'push'} modo
     'replace' → history.replaceState (padrão — não cria entrada
                 no histórico, ideal para inicialização de página)
     'push'    → history.pushState (cria entrada no histórico,
                 ideal quando o usuário troca de disciplina e
                 deve poder voltar com o botão Voltar)
───────────────────────────────────────────────────────────── */
export function sincronizarSemNaURL(sem, modo = 'replace') {
  try {
    const url = new URL(location.href);
    if (url.searchParams.get('sem') === sem) return; // já está correto
    url.searchParams.set('sem', sem);
    if (modo === 'push') history.pushState({}, '', url.toString());
    else                 history.replaceState(null, '', url.toString());
  } catch (_) { /* href malformado — ignora silenciosamente */ }
}

/* ─────────────────────────────────────────────────────────────
   propagarSemNosLinks
   Percorre todos os <a> que combinam com os seletores CSS
   fornecidos e adiciona/atualiza ?sem= no href de cada um.
   Preserva todos os outros parâmetros existentes no link.

   @param {string}   sem       — ex: '2026.2'
   @param {string[]} seletores — lista de CSS selectors

   Exemplo:
     propagarSemNosLinks('2026.2', [
       'a[href*="template.html"]',
       'a[href*="quiz.html"]',
     ]);
───────────────────────────────────────────────────────────── */
export function propagarSemNosLinks(sem, seletores) {
  if (!seletores?.length) return;
  const query = seletores.join(', ');
  document.querySelectorAll(query).forEach(a => {
    try {
      const url = new URL(a.href, location.href);
      url.searchParams.set('sem', sem);
      a.href = url.toString();
    } catch (_) { /* href inválido — ignora */ }
  });
}