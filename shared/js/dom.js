/* ============================================================
   NEXUS STUDY — shared/dom.js
   Utilitários de DOM compartilhados entre páginas.

   Funções:
     criarSemestreSelect(wrapId, onChange, semestreAtual?) → monta <select> de semestre
     preencherAnos(ids?)                                  → preenche ano atual em elementos
     setText(id, text)                                    → atalho para textContent
     setHTML(id, html)                                    → atalho para innerHTML
   ============================================================ */

import { SEMESTRES, getSemestreAtual, setSemestre } from '../../src/global.js';

/* ─────────────────────────────────────────────────────────────
   criarSemestreSelect
   Cria e injeta um <select> de semestres dentro do elemento
   identificado por wrapId.

   @param {string}   wrapId         — id do elemento container
   @param {Function} onChange       — callback(sem: string) chamado
                                      após setSemestre, com o novo valor
   @param {string}   [semestreAtual] — semestre pré-selecionado;
                                      usa getSemestreAtual() se omitido

   Exemplo — index.js:
     criarSemestreSelect('semestre-wrap', sem => {
       document.dispatchEvent(
         new CustomEvent('nexus:semestreChanged', { detail: sem })
       );
     });

   Exemplo — resumo.js:
     criarSemestreSelect('semestre-wrap-resumo', sem => {
       State.semestre = sem;
       // ... restante do callback local
     }, State.semestre);
───────────────────────────────────────────────────────────── */
export function criarSemestreSelect(wrapId, onChange, semestreAtual) {
  const wrap = document.getElementById(wrapId);
  if (!wrap) return;

  const atual  = semestreAtual ?? getSemestreAtual();
  const select = document.createElement('select');
  select.className = 'semestre-select';
  select.title     = 'Selecionar semestre';

  SEMESTRES.forEach(s => {
    const opt       = document.createElement('option');
    opt.value       = s;
    opt.textContent = s;
    if (s === atual) opt.selected = true;
    select.appendChild(opt);
  });

  select.addEventListener('change', e => {
    const novo = e.target.value;
    setSemestre(novo);
    onChange?.(novo);
  });

  wrap.appendChild(select);
}

/* ─────────────────────────────────────────────────────────────
   preencherAnos
   Preenche o ano atual em todos os elementos cujos ids são
   passados. Ignora silenciosamente ids não encontrados.

   @param {string[]} [ids] — padrão: ['footer-year', 'sidebar-year']

   Exemplo:
     preencherAnos();                          // usa os ids padrão
     preencherAnos(['footer-year']);           // só o footer
───────────────────────────────────────────────────────────── */
export function preencherAnos(ids = ['footer-year', 'sidebar-year']) {
  const ano = new Date().getFullYear();
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = ano;
  });
}

/* ─────────────────────────────────────────────────────────────
   setText / setHTML
   Atalhos para atualizar textContent e innerHTML via id.
   Ignoram silenciosamente ids não encontrados.

   Exemplo (template_init.js):
     setText('disc-nome', info.nome);
     setHTML('page-title-h1', modoConfig.h1);
───────────────────────────────────────────────────────────── */
export function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

export function setHTML(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}