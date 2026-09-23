/* =============================================
   NEXUS STUDY — resumo/resumo.js  (v14 — organizado em 3 módulos)
   Ponto de entrada da página de Resumos: inicializa
   o estado, a IA, resolve o contexto (semestre/
   disciplina), monta header/sidebar/conteúdo e liga
   os handlers que não pertencem a um módulo específico
   (voltar, barra de progresso, troca de disciplina).
   A implementação de cada responsabilidade vive em
   js/resumo-utils.js, js/resumo-ui.js e
   js/resumo-reader.js — ver cada arquivo para o
   detalhe.
   ============================================= */

import {
  setDisciplina,
  setPagina,
} from '../src/global.js';

import { sincronizarSemNaURL } from '../shared/js/utils/url.js';
import { preencherAnos } from '../shared/js/utils/dom.js';
import { aplicarCoresDisciplina } from '../shared/js/themes/theme.js';
import { injetarLogo } from '../shared/js/utils/logo.js';
import { Sound, playSound } from '../shared/js/audio/audio-api.js';

import '../src/session-tracker.js';

import { State, carregarIA, resolverContexto, renderSemestreBadge } from './js/resumo-utils.js';
import { renderHeader, renderSidebar, carregarConteudo, setModo, setProfessorFiltro } from './js/resumo-ui.js';
import { bindModal, bindTocChrome, bindCopyButton, bindThemeToggle } from './js/resumo-reader.js';
import { initPdfModal } from './js/resumo-pdf.js';

injetarLogo('#header-logo-wrap');

carregarIA();

function _initProgressBar() {
  const bar = document.getElementById('reading-progress');
  if (!bar) return;
  document.addEventListener('scroll', () => {
    bar.classList.remove('reading-progress--visible');
  });
}

function trocarDisciplina(disc) {
  if (disc.id === State.disciplina?.id) return;
  playSound('click', 'resumos');
  State.disciplina   = disc;
  State.temConteudo  = null;
  State.aulas        = [];
  State.simplificado = [];
  State.resumao      = [];
  State.modo         = 'completo';
  State.professorFiltro = null;
  setDisciplina(disc.id);

  sincronizarSemNaURL(State.semestre, 'push');
  const url = new URL(window.location.href);
  url.searchParams.set('disc', disc.id);
  window.history.pushState({}, '', url);

  renderHeader();
  aplicarCoresDisciplina(disc.arquivo, State.DISC_CORES);
  renderSidebar(trocarDisciplina);
  carregarConteudo();
}

document.addEventListener('DOMContentLoaded', async () => {
  setPagina('RESUMO');
  preencherAnos();

  if (typeof window.__nexusPageEnter === 'function') {
    window.__nexusPageEnter(location.pathname);
  }

  Sound.init();

  try {
    const mod = await import('../shared/js/themes/cores.js');
    State.DISC_CORES = mod.DISC_CORES ?? {};
  } catch (_) {}

  try {
    const mod = await import('../content/resumo/videos.js');
    State.getVideos = mod.getVideos ?? null;
  } catch (_) {}

  resolverContexto();

  renderSemestreBadge({
    onChange: () => {
      renderHeader();
      renderSidebar(trocarDisciplina);
      carregarConteudo();
    },
  });

  renderHeader();
  renderSidebar(trocarDisciplina);

  bindModal();
  bindTocChrome();
  bindCopyButton();
  bindThemeToggle();
  initPdfModal();
  _initProgressBar();
  carregarConteudo();

  document.getElementById('btn-back')?.addEventListener('mouseenter', () => playSound('hover', 'resumos'));
  document.getElementById('btn-back')?.addEventListener('click',      () => playSound('click', 'resumos'));

  // Sidebar — "Tipo de Conteúdo" (Resumo/Resumão/Síntese). Reaproveita
  // setModo() (resumo-ui.js), a MESMA função usada pelo toggle do topo —
  // só um novo gatilho de clique, nenhuma lógica de troca criada aqui.
  document.getElementById('modo-list')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-modo]');
    if (!btn) return;
    setModo(btn.dataset.modo);
  });

  // Sidebar — "Professor". Mesma abordagem de delegação do modo-list
  // acima: os botões são recriados a cada troca de disciplina/aulas
  // (ver renderProfessorSidebar() em resumo-ui.js), então o listener
  // fica no container fixo, não nos botões.
  document.getElementById('professor-list')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-professor]');
    if (!btn) return;
    setProfessorFiltro(btn.dataset.professor);
  });
});