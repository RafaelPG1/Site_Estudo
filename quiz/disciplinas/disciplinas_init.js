// @ts-nocheck
/* =============================================
   NEXUS STUDY — quiz/disciplinas/disciplinas_init.js

   v3.2 — filtro com display:none + delay dinâmico
   ─────────────────────────────────────────────
   Cards começam com display:none via CSS.
   Após o filtro, os sobreviventes recebem display:flex
   e --card-delay calculado pela posição real (0, 1, 2...),
   garantindo que o grid reflua corretamente e a animação
   escalonada funcione independente de quais cards existem.
   ============================================= */

import { DISC_CORES } from '../../shared/js/themes/cores.js';
import { resolverSemestreDeURL, sincronizarSemNaURL, propagarSemNosLinks } from '../../shared/js/utils/url.js';
import { aplicarCoresDisciplina } from '../../shared/js/themes/theme.js';
import { injetarLogo } from '../../shared/js/utils/logo.js';
import { Sound, audio, installAudioRecovery, playSound } from '../../shared/js/audio/audio-api.js';
import { parseSemestre } from '../../src/global.js';

/* ── APLICA CORES DA DISCIPLINA (síncrono, sem FOUC) ─────── */
const _discId = location.pathname.split('/').pop().replace('.html', '');

aplicarCoresDisciplina(_discId, DISC_CORES);

/* ── UTILITÁRIO: monta caminho do JS de questões ─────────── */
function _caminhoQuestoes(sem, discId) {
  const { ano, periodo, ap } = parseSemestre(sem);
  const base = `../../../content/quiz/${ano}/${periodo}`;
  if (ap) {
    return `${base}/${ap}/ques_${discId}.js`;
  }
  return `${base}/ques_${discId}.js`;
}

/* ── CARREGA JS DE QUESTÕES ──────────────────────────────── */
function _carregarQuestoes(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.onload  = () => resolve();
    s.onerror = () => reject(new Error(`Não foi possível carregar: ${src}`));
    document.head.appendChild(s);

    setTimeout(() => reject(new Error(`Timeout: ${src}`)), 5000);
  });
}

/* ── REVELA CARDS COM DELAY DINÂMICO ─────────────────────── */
/**
 * Recebe a lista de cards sobreviventes, atribui --card-delay
 * com base na posição real (0, 1, 2...) e remove display:none.
 * O grid reflui do zero — sempre da esquerda para a direita.
 */
function _revelarCards(cards) {
  cards.forEach(function (card, i) {
    card.style.setProperty('--card-delay', `${0.05 + i * 0.08}s`);
    card.classList.add('visivel');
  });
}

/* ── FILTRA CARDS E DISPARA ANIMAÇÃO ─────────────────────── */
function _filtrarCardsPorQuestoes() {
  const questoes = window.questoes;

  const todos = Array.from(document.querySelectorAll('[data-modo]'));

  if (!questoes || typeof questoes !== 'object') {
    console.warn('[disciplinas_init] window.questoes não disponível — exibindo todos os cards.');
    _revelarCards(todos);
    return;
  }

  const sobreviventes = todos.filter(function (card) {
    const modo = card.dataset.modo;
    return Array.isArray(questoes[modo]) && questoes[modo].length > 0;
  });

  _revelarCards(sobreviventes);
}

/* ── SEMESTRE, LINKS E FILTRO ────────────────────────────── */
(async function () {
  const sem = resolverSemestreDeURL();
  sincronizarSemNaURL(sem);
  propagarSemNosLinks(sem, [
    'a[href*="ava_template"]',
    'a[href*="quiz_template"]',
    'a[href*="quiz.html"]',
    'a[href*="template.html"]',
  ]);

  const badge = document.getElementById('header-sem-badge');
  if (badge) badge.textContent = sem;

  // Compatibilidade com data-semestres (HTML antigo)
  const semBase = sem.split('-')[0];
  document.querySelectorAll('[data-semestres]').forEach(function (card) {
    const semestresDoCard = card.dataset.semestres.split(',').map(s => s.trim());
    const visivel = semestresDoCard.includes(sem) || semestresDoCard.includes(semBase);
    if (!visivel) card.style.display = 'none';
  });

  // Carrega questões → filtra → anima só os sobreviventes
  const src = _caminhoQuestoes(sem, _discId);
  try {
    await _carregarQuestoes(src);
    _filtrarCardsPorQuestoes();
  } catch (err) {
    console.warn('[disciplinas_init] Erro ao carregar questões:', err.message);
    // Fail-open: mostra todos
    _revelarCards(Array.from(document.querySelectorAll('[data-modo]')));
  }
})();

/* ── ÁUDIO + LOGO ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  Sound.init();
  installAudioRecovery({ Sound, audio });
  await Sound.waitUntilReady();

  injetarLogo('#header-logo-wrap');

  document.getElementById('back-btn')
    ?.addEventListener('click', () => playSound('click', 'quiz'));

  document.querySelectorAll('.modes-grid a, .disc-card').forEach(card => {
    card.addEventListener('mouseenter', () => playSound('hover', 'quiz'));
    card.addEventListener('click',      () => playSound('click', 'quiz'));
  });
});