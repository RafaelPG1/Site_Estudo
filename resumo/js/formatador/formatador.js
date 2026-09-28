/* =============================================
   NEXUS STUDY — resumo/js/formatador/formatador.js
   Formatador: tela única + ponto de entrada (usado por resumo.js).
     Prompt          → modelos (Resumo, Resumão, Síntese, …) que definem
                       COMO um conteúdo deve ser organizado; editável.
                       (Independente da conversão da área Texto.)
     Texto           → conteúdo ESTRUTURADO colado pelo usuário
                       ({ aula, ideia_central, secoes }) + "Formatar texto".
     Formatar texto  → converterEstrutura() (formatador-conteudo.js) valida
                       o objeto e gera o texto de leitura; salvar()
                       (formatador-storage.js) guarda. O título é o campo
                       `aula`.
     Meus conteúdos  → lateral direita; lista o que foi formatado.
                       Clicar abre no resumo-reader EXISTENTE
                       (abrirNoLeitor, abaixo) — não há outro leitor.
   Módulos: formatador-ui.js (marcação) · formatador-prompts.js (modelos)
            formatador-conteudo.js (conversão) · formatador-storage.js
            (IndexedDB).
   Abre "por cima" da Home via body.tela-formatador (ver
   css/formatador.css); não toca nos modos do Resumo.
   ============================================= */

import { playSound } from '../../../shared/js/audio/audio-api.js';
import { State, esc } from '../resumo-utils.js';
import { abrirModal } from '../resumo-reader.js';
import { MODELOS_PROMPT, garantirEstrutura, extrairEstrutura } from './formatador-prompts.js';
import { montarView } from './formatador-ui.js';
import { converterEstrutura } from './formatador-conteudo.js';
import { salvar, listar, obter, remover, persistente } from './formatador-storage.js';

import { iniciarTooltips } from './formatador-tooltip.js';
import { confirmar } from './formatador-dialogo.js';

const $ = id => document.getElementById(id);

let _montado = false;
let _ocupado = false;
const _statusTimers = {};

async function _copiar(texto) {
  try { await navigator.clipboard.writeText(texto); return true; } catch (_) {}
  try {
    const ta = document.createElement('textarea');
    ta.value = texto; ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy'); ta.remove(); return ok;
  } catch (_) { return false; }
}

function _status(msg, tipo, ms = 2600, id = 'fmt-status') {
  const el = $(id);
  if (!el) return;
  clearTimeout(_statusTimers[id]);
  el.textContent = msg;
  el.dataset.tipo = tipo ?? '';
  if (ms && msg) _statusTimers[id] = setTimeout(() => { el.textContent = ''; el.dataset.tipo = ''; }, ms);
}

/* ── Prompt: modelos preenchem o campo com o prompt completo (segue editável) ── */
let _modeloAtivo = null;     // modelo cujo texto foi colocado no campo
let _textoDoModelo = '';     // texto exato colocado — para saber se o usuário editou

function _usarModelo(id) {
  const m = MODELOS_PROMPT.find(x => x.id === id);
  if (!m) return;
  const campo = $('fmt-instrucao');

  // Não perder um prompt que o usuário escreveu/editou sem avisar.
  const atual = campo.value.trim();
  const editado = atual && (!_modeloAtivo || atual !== _textoDoModelo.trim());
  if (editado && !window.confirm('Substituir o prompt atual pelo modelo "' + m.nome + '"?')) return;

  _modeloAtivo = m;
  _textoDoModelo = m.texto;
  campo.value = m.texto;
  campo.scrollTop = 0;

  document.querySelectorAll('.fmt__chip').forEach(b => {
    const on = b.dataset.modelo === id;
    b.classList.toggle('fmt__chip--ativo', on);
    b.setAttribute('aria-pressed', String(on));
  });
  const d = $('fmt-modelo-desc');
  d.textContent = m.desc;
  d.hidden = false;
  _status('');
}

async function _copiarPrompt() {
  const campo = $('fmt-instrucao');
  if (!campo.value.trim()) {
    _status('Escolha um modelo ou escreva seu prompt primeiro.', 'erro');
    campo.focus();
    return;
  }
  // Modelos já trazem a estrutura; um prompt escrito do zero recebe-a ao final.
  const { texto, adicionou } = garantirEstrutura(campo.value);
  const ok = await _copiar(texto);
  _status(
    ok ? (adicionou ? '✓ Copiado. A estrutura do Nexus foi adicionada ao final.' : '✓ Prompt completo copiado.')
       : 'Não foi possível copiar.',
    ok ? 'ok' : 'erro',
    ok ? 3200 : 0
  );
}

async function _copiarEstrutura() {
  const campo = $('fmt-instrucao');
  if (!campo.value.trim()) {
    _status('Escolha um modelo ou escreva seu prompt primeiro.', 'erro');
    campo.focus();
    return;
  }
  const ok = await _copiar(extrairEstrutura(campo.value));
  _status(ok ? '✓ Estrutura copiada.' : 'Não foi possível copiar.', ok ? 'ok' : 'erro', ok ? 3200 : 0);
}

/* ── Texto: entrada + contador ── */
function _atualizarContador() {
  const t = $('fmt-texto').value;
  let palavras = 0, dentro = false;
  for (let i = 0; i < t.length; i++) {          // sem alocar arrays: textos colados podem ser grandes
    const espaco = /\s/.test(t[i]);
    if (!espaco && !dentro) palavras++;
    dentro = !espaco;
  }
  const fmt = n => n.toLocaleString('pt-BR');
  $('fmt-count').textContent =
    `${fmt(palavras)} palavra${palavras !== 1 ? 's' : ''} · ${fmt(t.length)} caractere${t.length !== 1 ? 's' : ''}`;
}

function _ligarCampos() {
  $('fmt-texto').addEventListener('input', _atualizarContador);   // digitar, colar, recortar, desfazer
  // Atalhos globais da página (busca, IA flutuante etc.) não devem "ouvir"
  // o que é digitado aqui: o teclado do campo fica só com o campo.
  ['keydown', 'keyup', 'keypress'].forEach(ev => $('fmt-texto').addEventListener(ev, e => e.stopPropagation()));
  _atualizarContador();                                  // cobre valor restaurado pelo navegador
  _sincronizarAlturas();
}

/* Prompt e Texto sempre com a MESMA altura: o resize nativo de uma caixa
   (só vertical, via CSS) é repassado à outra. */
function _sincronizarAlturas() {
  const a = $('fmt-instrucao'), b = $('fmt-texto');
  if (!a || !b || typeof ResizeObserver === 'undefined') return;
  const ro = new ResizeObserver(entradas => {
    for (const { target } of entradas) {
      const outra = target === a ? b : a;
      const h = target.offsetHeight;
      if (h > 0 && outra.offsetHeight !== h) outra.style.height = h + 'px';
    }
  });
  ro.observe(a);
  ro.observe(b);
}

/* ── Formatar texto ── */
async function _formatar() {
  if (_ocupado) return;
  const texto = $('fmt-texto');
  const btn = $('fmt-btn-formatar');
  const st = (m, t, ms) => _status(m, t, ms, 'fmt-status-formatar');

  if (!texto.value.trim()) { st('Cole o conteúdo estruturado no campo Texto primeiro.', 'erro'); texto.focus(); return; }

  _ocupado = true;
  btn.disabled = true;
  const rotuloBtn = btn.textContent;
  btn.textContent = 'Formatando…';
  st('');

  try {
    const r = converterEstrutura(texto.value);
    const meta = await salvar({
      titulo: r.aula.aula,
      textoOriginal: texto.value,
      prompt: $('fmt-instrucao').value,
      aula: r.aula,
      leitura: r.leitura,
      formato: _modeloAtivo?.nome ?? '',   // só o selo no leitor; a estrutura vem pronta na entrada
    });
    await _renderLista(meta.id);

    const aviso = r.avisos?.length ? ' ' + r.avisos.join(' ') : '';
    st(`✓ “${meta.titulo}” foi adicionado a Meus conteúdos.${aviso}`, 'ok', aviso ? 7000 : 4200);
  } catch (err) {
    st(err?.message || 'Não foi possível formatar o texto.', 'erro', 7000);
  } finally {
    _ocupado = false;
    btn.disabled = false;
    btn.textContent = rotuloBtn;
  }
}

/* ── Meus conteúdos ── */
const ICONE_DOC = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6"/><path d="M9 17h4"/></svg>`;
const ICONE_LIXO = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg>`;

function _data(ms) {
  try { return new Date(ms).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', ''); }
  catch (_) { return ''; }
}

async function _renderLista(novoId) {
  const host = $('fmt-lista');
  if (!host) return;
  let itens = [];
  try { itens = await listar(); } catch (_) {}

  if (!itens.length) {
    host.innerHTML = `
      <div class="fmt__vazio-card">
        <span class="fmt__vazio-icone">${ICONE_DOC}</span>
        <strong class="fmt__vazio-titulo">Nenhum conteúdo ainda</strong>
        <span class="fmt__vazio-txt">Quando você formatar um texto, ele aparece aqui.</span>
      </div>`;
    return;
  }

  let html = itens.map(m => {
    const n = m.secoes ?? 0;
    const meta = [m.formato, `${n} seç${n !== 1 ? 'ões' : 'ão'}`, _data(m.criadoEm)].filter(Boolean).join(' · ');
    return `
      <div class="fmt__item${m.id === novoId ? ' fmt__item--novo' : ''}">
        <button type="button" class="fmt__item-abrir" data-fmt="abrir" data-id="${esc(m.id)}" data-tip="${esc(m.previa ?? '')}">
          <span class="fmt__item-titulo">${esc(m.titulo)}</span>
          <span class="fmt__item-meta">${esc(meta)}</span>
        </button>
        <button type="button" class="fmt__item-del" data-fmt="remover" data-id="${esc(m.id)}" aria-label="Excluir ${esc(m.titulo)}" data-tip="Excluir">${ICONE_LIXO}</button>
      </div>`;
  }).join('');

  if (!(await persistente())) {
    html += `<p class="fmt__vazio fmt__vazio--aviso">O navegador não permite salvar neste modo (ex.: navegação privada): estes conteúdos somem ao recarregar a página.</p>`;
  }
  host.innerHTML = html;
  if (novoId) host.querySelector('.fmt__item--novo')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* Ponte para o leitor EXISTENTE (abrirModal em resumo-reader.js). Nenhuma
   linha do leitor foi alterada: o conteúdo já sai no formato que ele
   consome, então só o "moldamos" ao contexto — o leitor lê State.disciplina
   para o rótulo/eyebrow e a chave do accordion. Trocamos esse campo SÓ
   durante a chamada síncrona de abrirModal() e restauramos em seguida
   (finally), então State nunca fica com a disciplina "falsa".
   rotulo: nome do formato (Resumo, Síntese…) mostrado no selo do leitor. */
const ROTULO_LEITOR = 'Formatador';

function abrirNoLeitor(aula, { rotulo } = {}) {
  const original = State.disciplina;
  // Mantém `arquivo`/demais campos da disciplina real (o leitor os usa
  // para resolver base de imagens); só id/nome mudam.
  State.disciplina = { ...(original ?? {}), id: 'formatador', nome: ROTULO_LEITOR };
  try {
    // idx omitido de propósito: sem ele o leitor não inventa o número
    // grande "1" quando o título não traz "Aula N".
    abrirModal(aula);
  } finally {
    State.disciplina = original;
  }

  // abrirModal() rotula o selo como "Resumo"/"Síntese" conforme State.modo
  // (mesmo ajuste que abrirResultadoBusca faz para os seus tipos).
  const badge = document.getElementById('rm-tipo-badge');
  if (badge) badge.textContent = rotulo || ROTULO_LEITOR;
}

async function _abrirConteudo(id) {
  let reg = null;
  try { reg = await obter(id); } catch (_) {}
  if (!reg?.aula) { _status('Não foi possível abrir este conteúdo.', 'erro', 3500, 'fmt-status-formatar'); return; }
  abrirNoLeitor(reg.aula, { rotulo: reg.formato });
}

async function _removerConteudo(id) {
  const reg = (await listar().catch(() => [])).find(m => m.id === id);
  const ok = await confirmar({
    titulo: 'Excluir conteúdo?',
    destaque: reg?.titulo ?? 'este conteúdo',
    texto: 'Ele será removido de Meus conteúdos. Esta ação não pode ser desfeita.',
    icone: ICONE_LIXO,
    rotuloOk: 'Excluir',
    perigo: true,
  });
  if (!ok) return;
  try { await remover(id); } catch (_) {}
  await _renderLista();
}

function _ligar(view) {
  view.addEventListener('click', e => {
    const chip = e.target.closest('[data-modelo]');
    if (chip) { playSound('select', 'resumos'); _usarModelo(chip.dataset.modelo); return; }

    const el = e.target.closest('[data-fmt]');
    const acao = el?.dataset.fmt;
    if (acao === 'voltar') { playSound('click', 'resumos'); fechar(); }
    else if (acao === 'copiar') { playSound('click', 'resumos'); _copiarPrompt(); }
    else if (acao === 'copiar-estrutura') { playSound('click', 'resumos'); _copiarEstrutura(); }
    else if (acao === 'formatar') { playSound('click', 'resumos'); _formatar(); }
    else if (acao === 'abrir') { _abrirConteudo(el.dataset.id); }
    else if (acao === 'remover') { playSound('click', 'resumos'); _removerConteudo(el.dataset.id); }
  });

  _ligarCampos();
}

/* ── API pública (usada por resumo.js) ── */
function _montar() {
  if (_montado) return true;
  const host = $('formatador-view');
  if (!host) return false;
  montarView(host);
  _ligar(host);
  iniciarTooltips(host);
  _renderLista();
  _montado = true;
  return true;
}

export function estaAberto() {
  return document.body.classList.contains('tela-formatador');
}

export function abrir() {
  if (!_montar()) return;
  document.body.classList.add('tela-formatador');
  const bc = $('header-breadcrumb');
  if (bc) bc.innerHTML = 'Resumos <span>· Formatador</span>';
  document.title = 'Formatador — Nexus Study';
  window.scrollTo(0, 0);
}

export function fechar() {
  if (!estaAberto()) return;
  document.body.classList.remove('tela-formatador');
  const bc = $('header-breadcrumb');
  if (bc) bc.textContent = 'Resumos';
  document.title = 'Resumos · Nexus Study';
}

export function initFormatador() {
  const btn = $('btn-abrir-formatador');
  if (!btn) return;
  btn.addEventListener('mouseenter', () => playSound('hover', 'resumos'));
  btn.addEventListener('click', () => { playSound('click', 'resumos'); abrir(); });
}