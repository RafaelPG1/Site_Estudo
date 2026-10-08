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
import { carregarIA } from '../shared/js/ia/carregar-ia.js';

import { State, resolverContexto, renderSemestreBadge } from './js/resumo-utils.js';
import { renderHeader, renderSidebar, carregarConteudo, setModo, setProfessorFiltro } from './js/resumo-ui.js';
import { bindModal, bindTocChrome, bindCopyButton, bindThemeToggle } from './js/resumo-reader.js';
import { initPdfModal } from './js/pdf/resumo-pdf.js';
import { initBusca, limparBusca, atualizarContextoBusca, definirEscopoInicial } from './js/resumo-busca.js';
import { initFormatador, fechar as fecharFormatador } from './js/formatador/formatador.js';

injetarLogo('#header-logo-wrap');

carregarIA('Resumo');

function _initProgressBar() {
  const bar = document.getElementById('reading-progress');
  if (!bar) return;
  document.addEventListener('scroll', () => {
    bar.classList.remove('reading-progress--visible');
  });
}

/* manterBusca: usado só pela própria busca ao abrir um resultado de outra
   disciplina (o leitor precisa dela ativa) — o usuário deve voltar aos
   resultados ao fechar. Qualquer outra troca (clique na sidebar) sai da
   busca e volta à listagem de cards. */
function trocarDisciplina(disc, { manterBusca = false } = {}) {
  fecharFormatador();
  if (!manterBusca) limparBusca();
  // Vindo da Home, mesmo a disciplina de fallback (a que resolverContexto()
  // já tinha resolvido internamente, ver js/resumo-utils.js) precisa
  // "confirmar" a seleção e sair da Home — por isso o early-return abaixo
  // não vale enquanto State.emHome for true.
  if (!State.emHome && disc.id === State.disciplina?.id) return;
  playSound('click', 'resumos');
  State.emHome       = false;
  document.body.classList.remove('tela-home');
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
  renderSidebar(trocarDisciplina, irParaHome);
  carregarConteudo();
  atualizarContextoBusca();
}

/* Início — volta para a Home da área de Resumo a partir de qualquer
   disciplina (primeiro item de #disc-list, ver renderSidebar() em
   js/resumo-ui.js). Espelha trocarDisciplina(): mesma limpeza de
   busca, mesma sincronização de URL, só que "desmarcando" a
   disciplina em vez de escolher uma. */
function irParaHome() {
  // Se o Formatador está aberto por cima da Home, "Início" só o fecha.
  fecharFormatador();
  if (State.emHome) return;
  limparBusca();
  playSound('click', 'resumos');
  State.emHome = true;
  document.body.classList.add('tela-home');

  const url = new URL(window.location.href);
  url.searchParams.delete('disc');
  window.history.pushState({}, '', url);

  renderHeader();
  renderSidebar(trocarDisciplina, irParaHome);
  atualizarContextoBusca();
  // Mesmo critério do carregamento inicial (ver DOMContentLoaded):
  // a Home nasce em "Todas as disciplinas".
  if (State.disciplinas.length > 1) definirEscopoInicial('todas');
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
  document.body.classList.toggle('tela-home', State.emHome);

  renderSemestreBadge({
    onChange: () => {
      limparBusca();
      renderHeader();
      renderSidebar(trocarDisciplina, irParaHome);
      // Trocar de semestre não tira a Home do ar sozinho — o usuário
      // ainda não escolheu disciplina nenhuma (ver trocarDisciplina()).
      if (!State.emHome) carregarConteudo();
      atualizarContextoBusca();
    },
  });

  renderHeader();
  renderSidebar(trocarDisciplina, irParaHome);

  bindModal();
  bindTocChrome();
  bindCopyButton();
  bindThemeToggle();
  initPdfModal();
  initBusca({ trocarDisciplina });
  initFormatador();
  // Home: busca nasce em "Todas as disciplinas" — ainda não há uma
  // disciplina "atual" de verdade para restringir a busca a ela.
  if (State.emHome) definirEscopoInicial('todas');
  _initProgressBar();
  if (!State.emHome) carregarConteudo();

  document.getElementById('btn-back')?.addEventListener('mouseenter', () => playSound('hover', 'resumos'));
  document.getElementById('btn-back')?.addEventListener('click',      () => playSound('click', 'resumos'));

  // Sidebar — "Tipo de Conteúdo" (Resumo/Resumão/Síntese). Reaproveita
  // setModo() (resumo-ui.js), a MESMA função usada pelo toggle do topo —
  // só um novo gatilho de clique, nenhuma lógica de troca criada aqui.
  document.getElementById('modo-list')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-modo]');
    if (!btn) return;
    limparBusca();   // escolher um tipo na sidebar volta à listagem de cards
    setModo(btn.dataset.modo);
  });

  // Sidebar — "Professor". Mesma abordagem de delegação do modo-list
  // acima: os botões são recriados a cada troca de disciplina/aulas
  // (ver renderProfessorSidebar() em resumo-ui.js), então o listener
  // fica no container fixo, não nos botões.
  document.getElementById('professor-list')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-professor]');
    if (!btn) return;
    limparBusca();
    setProfessorFiltro(btn.dataset.professor);
  });
});