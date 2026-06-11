/* ============================================================
   NEXUS STUDY — shared/js/utils/dom.js
   Utilitários de DOM compartilhados entre páginas.

   Funções:
     criarSemestreSelect(wrapId, onChange, semestreAtual?) → monta dropdown customizado de semestre
     preencherAnos(ids?)                                  → preenche ano atual em elementos
     setText(id, text)                                    → atalho para textContent
     setHTML(id, html)                                    → atalho para innerHTML

   v2 — FIX: overlay removido do body.
        O overlay tinha z-index: 199 no body. Se o <header> criar
        stacking context com z-index menor (ex: 100), o overlay ficava
        acima de todo o header — incluindo o painel e os .sp-item —
        interceptando todos os eventos de mouse e impedindo a seleção.
        Solução: fechar ao clicar fora via pointerdown no document,
        verificando se o clique foi dentro do .sp-wrap com closest().
   ============================================================ */

import { SEMESTRES, getSemestreAtual, setSemestre, parseSemestre } from '../../../src/global.js';

/* ─────────────────────────────────────────────────────────────
   criarSemestreSelect
   ─────────────────────────────────────────────────────────── */
export function criarSemestreSelect(wrapId, onChange, semestreAtual) {
  const wrap = document.getElementById(wrapId);
  if (!wrap) return;

  /* Limpa montagem anterior (evita duplicatas em _refreshHeader) */
  wrap.innerHTML = '';

  let atual = semestreAtual ?? getSemestreAtual();

  /* ── Agrupa semestres por ano ────────────────────────────── */
  const grupos = {};
  SEMESTRES.forEach(s => {
    const { ano } = parseSemestre(s);
    if (!grupos[ano]) grupos[ano] = [];
    grupos[ano].push(s);
  });

  /* ── Helpers de renderização ─────────────────────────────── */
  function _labelSemestre(s) {
    const { periodo, ap } = parseSemestre(s);
    return { periodo, ap };
  }

  function _renderTrigger() {
    const { periodo, ap } = _labelSemestre(atual);
    trigger.querySelector('.sp-trigger__label').textContent = periodo;
    const apEl = trigger.querySelector('.sp-trigger__ap');
    if (ap) {
      apEl.textContent = ap;
      apEl.style.display = '';
    } else {
      apEl.style.display = 'none';
    }
  }

  /* ── Monta o trigger (botão visível) ────────────────────── */
  const trigger = document.createElement('button');
  trigger.type      = 'button';
  trigger.className = 'sp-trigger';
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');
  trigger.innerHTML = `
    <span class="sp-trigger__label"></span>
    <span class="sp-trigger__ap"></span>
    <svg class="sp-trigger__arrow" viewBox="0 0 16 16" fill="none"
         xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4 6l4 4 4-4" stroke="currentColor"
            stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  /* ── Monta o painel (lista de opções) ────────────────────── */
  const panel = document.createElement('div');
  panel.className = 'sp-panel';
  panel.setAttribute('role', 'listbox');
  panel.setAttribute('aria-label', 'Selecionar semestre');

  Object.entries(grupos).forEach(([ano, semestres]) => {
    const group = document.createElement('div');
    group.className = 'sp-group';

    const label = document.createElement('div');
    label.className = 'sp-group__label';
    label.textContent = ano;
    group.appendChild(label);

    semestres.forEach(s => {
      const { periodo, ap } = _labelSemestre(s);

      const item = document.createElement('div');
      item.className  = 'sp-item' + (s === atual ? ' is-selected' : '');
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', s === atual ? 'true' : 'false');
      item.dataset.value = s;

      item.innerHTML = `
        <svg class="sp-item__check" viewBox="0 0 16 16" fill="none"
             xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M3 8l3.5 3.5L13 5"
                stroke="currentColor" stroke-width="1.8"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div class="sp-item__body">
          <span class="sp-item__periodo">${periodo}</span>
          ${ap ? `<span class="sp-item__ap">${ap}</span>` : ''}
        </div>
      `;

      item.addEventListener('click', () => {
        _selectItem(s);
        _close();
      });

      group.appendChild(item);
    });

    panel.appendChild(group);
  });

  /* ── Monta a .sp-wrap ────────────────────────────────────── */
  const spWrap = document.createElement('div');
  spWrap.className = 'sp-wrap';
  spWrap.appendChild(trigger);
  spWrap.appendChild(panel);
  wrap.appendChild(spWrap);

  /* ── Funções de estado ───────────────────────────────────── */
  function _open() {
    spWrap.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');

    /* Fecha ao clicar fora — registrado uma única vez por abertura.
       pointerdown captura antes do click, garantindo o fechamento
       mesmo que o elemento clicado seja removido do DOM antes do
       evento click borbulhar (ex: outro modal que se auto-destrói). */
    setTimeout(() => {
      document.addEventListener('pointerdown', _handleOutsideClick, { once: true });
    }, 0);
  }

  function _close() {
    spWrap.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    document.removeEventListener('pointerdown', _handleOutsideClick);
  }

  function _handleOutsideClick(e) {
    /* Se o clique foi dentro do spWrap, reabre o listener e não fecha */
    if (spWrap.contains(e.target)) {
      setTimeout(() => {
        document.addEventListener('pointerdown', _handleOutsideClick, { once: true });
      }, 0);
      return;
    }
    _close();
  }

  function _selectItem(novo) {
    atual = novo;
    setSemestre(novo);
    _renderTrigger();
    panel.querySelectorAll('.sp-item').forEach(el => {
      const selected = el.dataset.value === novo;
      el.classList.toggle('is-selected', selected);
      el.setAttribute('aria-selected', selected ? 'true' : 'false');
    });
    onChange?.(novo);
  }

  /* ── Eventos ─────────────────────────────────────────────── */
  trigger.addEventListener('click', () => {
    spWrap.classList.contains('is-open') ? _close() : _open();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') _close();
  });

  /* ── Estado inicial ──────────────────────────────────────── */
  _renderTrigger();
}

/* ─────────────────────────────────────────────────────────────
   preencherAnos
   ─────────────────────────────────────────────────────────── */
export function preencherAnos(ids = ['footer-year', 'sidebar-year']) {
  const ano = new Date().getFullYear();
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = ano;
  });
}

/* ─────────────────────────────────────────────────────────────
   setText / setHTML
   ─────────────────────────────────────────────────────────── */
export function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

export function setHTML(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}