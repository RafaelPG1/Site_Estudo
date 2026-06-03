// @ts-nocheck
/* =============================================
   NEXUS STUDY — quiz/disciplinas/disciplinas_init.js

   v3.0 — filtro dinâmico por window.questoes
   ─────────────────────────────────────────────
   Carrega o JS de questões do semestre/AP ativo e oculta
   os cards cujo data-modo não existe em window.questoes.
   Assim, não é necessário manter data-semestres manualmente
   em nenhum HTML de disciplina.

   Fluxo:
   1. Resolve o semestre da URL (ex: "2026.1-AP2")
   2. Extrai disciplina do pathname (ex: "banco_dados")
   3. Monta o caminho do JS: quiz/2026/2026.1/AP2/ques_banco_dados.js
   4. Injeta <script> e aguarda load
   5. Lê window.questoes e oculta cards sem conteúdo
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
/**
 * Dado "2026.1-AP2" e "banco_dados", retorna o caminho relativo
 * a partir de quiz/disciplinas/ até content/quiz/:
 *
 *   ../../content/quiz/2026/2026.1/AP2/ques_banco_dados.js
 *
 * Se sem for "2027.1" (sem AP), usa a raiz do período:
 *
 *   ../../content/quiz/2027/2027.1/ques_banco_dados.js
 */
function _caminhoQuestoes(sem, discId) {
  const { ano, periodo, ap } = parseSemestre(sem);
  const base = `../../../content/quiz/${ano}/${periodo}`;  // sobe de quiz/disciplinas/ para a raiz, entra em content/quiz/
  if (ap) {
    return `${base}/${ap}/ques_${discId}.js`;
  }
  return `${base}/ques_${discId}.js`;
}

/* ── CARREGA JS DE QUESTÕES E FILTRA CARDS ───────────────── */
/**
 * Injeta o script de questões no <head> e resolve quando carregado.
 * Rejeita se o arquivo não existir (404) ou demorar >5s.
 */
function _carregarQuestoes(src) {
  return new Promise((resolve, reject) => {
    // Evita duplo carregamento
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.onload  = () => resolve();
    s.onerror = () => reject(new Error(`Não foi possível carregar: ${src}`));
    document.head.appendChild(s);

    // Timeout de segurança
    setTimeout(() => reject(new Error(`Timeout: ${src}`)), 5000);
  });
}

/**
 * Oculta os cards cujo data-modo não existe como chave em window.questoes
 * ou cujo array esteja vazio.
 *
 * Se window.questoes não existir (JS não carregado), mantém todos visíveis
 * para não quebrar a UI.
 */
function _filtrarCardsPorQuestoes() {
  const questoes = window.questoes;

  if (!questoes || typeof questoes !== 'object') {
    // Sem dados: exibe tudo (fail-open)
    console.warn('[disciplinas_init] window.questoes não disponível — exibindo todos os cards.');
    return;
  }

  document.querySelectorAll('[data-modo]').forEach(function (card) {
    const modo = card.dataset.modo;
    const temConteudo = Array.isArray(questoes[modo]) && questoes[modo].length > 0;
    if (!temConteudo) {
      card.style.display = 'none';
    }
  });
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

  // Exibe o semestre ativo no header
  const badge = document.getElementById('header-sem-badge');
  if (badge) badge.textContent = sem;

  // Compatibilidade: se ainda houver cards com data-semestres (HTML antigo),
  // aplica filtro simples por semestre base antes do filtro dinâmico.
  const semBase = sem.split('-')[0]; // "2026.1-AP2" → "2026.1"
  document.querySelectorAll('[data-semestres]').forEach(function (card) {
    const semestresDoCard = card.dataset.semestres.split(',').map(s => s.trim());
    // Match exato (ex: "2026.1-AP2") OU match na base (ex: "2026.1")
    const visivel = semestresDoCard.includes(sem) || semestresDoCard.includes(semBase);
    if (!visivel) card.style.display = 'none';
  });

  // Carrega o JS de questões e filtra por data-modo
  const src = _caminhoQuestoes(sem, _discId);
  try {
    await _carregarQuestoes(src);
    _filtrarCardsPorQuestoes();
  } catch (err) {
    console.warn('[disciplinas_init] Erro ao carregar questões:', err.message);
    // Fail-open: mantém os cards visíveis
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