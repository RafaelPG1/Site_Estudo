/* =============================================
   NEXUS STUDY — resumo/js/resumo-continuar.js  (v10)
   "Continuar lendo": lembra, só neste navegador (localStorage),
   o último conteúdo aberto no leitor — semestre, disciplina,
   tipo de conteúdo (Resumo / Síntese / Resumão / Nota do
   Professor) e aula — e oferece um botão na Home dos Resumos.

   Sem Firestore, sem conta. Posição de rolagem NÃO é salva de
   propósito: depende do estado dos tópicos abertos, do tema e do
   zoom, e não é recuperável de forma confiável.

   Este módulo não importa o leitor nem a UI (evita ciclo): quem
   aplica a retomada é resumo.js.
   ============================================= */

import { State } from './resumo-utils.js';
import { getDisciplinasDeSemestre, parseSemestre } from '../../src/global.js';

const CHAVE = 'nexus_resumo_ultima_leitura';

export const ROTULO_TIPO = {
  completo:  'Resumo',
  sintese:   'Síntese',
  resumao:   'Resumão',
  professor: 'Nota do Professor',
};

function _uid() {
  try {
    const u = JSON.parse(localStorage.getItem('nexus_usuario') || 'null');
    return (u && u.uid) ? u.uid : 'guest';
  } catch (_) { return 'guest'; }
}

function _chave() { return CHAVE + '_' + _uid(); }

export function lerUltimaLeitura() {
  try {
    const r = JSON.parse(localStorage.getItem(_chave()) || 'null');
    if (!r || r.v !== 1 || !r.sem || !r.disc || !ROTULO_TIPO[r.modo] || !r.aula) return null;
    return r;
  } catch (_) { return null; }
}

export function limparUltimaLeitura() {
  try { localStorage.removeItem(_chave()); } catch (_) {}
}

/* Chamado pelas 3 funções que abrem o leitor. `conteudo` é o objeto da
   aula aberta; o título dele (campo `aula`) identifica a aula. */
export function registrarLeitura(modo, idx, conteudo) {
  try {
    if (!ROTULO_TIPO[modo] || !State.disciplina || !State.semestre) return;
    const aula = (conteudo && conteudo.aula) || State.aulas[idx]?.aula;
    if (!aula) return;
    localStorage.setItem(_chave(), JSON.stringify({
      v: 1,
      sem: State.semestre,
      disc: State.disciplina.id,
      discNome: State.disciplina.apelido ?? State.disciplina.nome ?? '',
      modo,
      aula: String(aula),
      idx: Number.isInteger(idx) ? idx : null,
      ts: Date.now(),
    }));
  } catch (_) { /* storage indisponível: simplesmente não lembra */ }
}

/* Caminho (relativo a resumo.html) do arquivo de conteúdo da disciplina. */
function _srcConteudo(sem, disc) {
  const { ano, periodo, ap } = parseSemestre(sem);
  return `../content/resumo/${ano}/${periodo}${ap ? '/' + ap : ''}/res_${disc.arquivo}.js`;
}

/* Valida o destino salvo: a disciplina ainda existe nesse semestre e o
   arquivo de conteúdo responde. (Se a aula específica sumiu do conteúdo,
   a retomada percebe ao chegar e cai na listagem da disciplina.) */
export async function destinoValido(r) {
  if (!r) return null;
  let disc;
  try { disc = (getDisciplinasDeSemestre(r.sem) || []).find(d => d.id === r.disc); } catch (_) {}
  if (!disc) return null;
  try {
    const res = await fetch(_srcConteudo(r.sem, disc), { method: 'HEAD', cache: 'no-cache' });
    if (!res.ok) return null;
  } catch (_) { return null; }
  return disc;
}

export function hrefRetomada(r) {
  const url = new URL(window.location.href);
  url.search = '';
  url.hash = '';
  url.searchParams.set('sem', r.sem);
  url.searchParams.set('disc', r.disc);
  url.searchParams.set('retomar', '1');
  return url.pathname + url.search;
}

/* Desenha o botão na Home. Só aparece se houver destino válido. */
export async function renderContinuar(onClick) {
  const box = document.getElementById('resumo-continuar');
  if (!box) return;
  box.hidden = true;
  box.innerHTML = '';
  const r = lerUltimaLeitura();
  const disc = await destinoValido(r);
  if (!disc) return;

  const a = document.createElement('a');
  a.className = 'resumo-continuar__btn';
  a.href = hrefRetomada(r);
  a.id = 'resumo-continuar-btn';
  /* cor da disciplina (a mesma dos cards e da lista de disciplinas) */
  const cores = State.DISC_CORES?.[disc.arquivo];
  if (cores?.corTemaRgb) {
    a.style.setProperty('--cc',     cores.corTema);
    a.style.setProperty('--cc-rgb', cores.corTemaRgb);
  }
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  a.innerHTML =
    '<span class="resumo-continuar__icone" aria-hidden="true">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>' +
    '</span>' +
    '<span class="resumo-continuar__texto">' +
      '<span class="resumo-continuar__rotulo">Continuar lendo</span>' +
      '<span class="resumo-continuar__aula">' + esc(r.aula) + '</span>' +
      '<span class="resumo-continuar__meta">' + esc(r.discNome || disc.nome) + ' · ' + esc(ROTULO_TIPO[r.modo]) + '</span>' +
    '</span>' +
    '<span class="resumo-continuar__seta" aria-hidden="true">→</span>';
  if (onClick) a.addEventListener('click', onClick);
  box.appendChild(a);
  box.hidden = false;
}

/* Lê ?retomar=1 da URL: devolve o registro salvo se ele bate com a
   disciplina aberta; sempre remove o parâmetro da URL. */
export function consumirRetomadaDaURL() {
  const url = new URL(window.location.href);
  if (url.searchParams.get('retomar') !== '1') return null;
  url.searchParams.delete('retomar');
  try { window.history.replaceState(null, '', url.pathname + url.search + url.hash); } catch (_) {}
  const r = lerUltimaLeitura();
  if (!r || !State.disciplina || r.disc !== State.disciplina.id) return null;
  return r;
}
