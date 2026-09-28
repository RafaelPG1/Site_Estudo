/* =============================================
   NEXUS STUDY — resumo/js/formatador/formatador-reader.js
   Ponte para o leitor EXISTENTE (abrirModal em resumo-reader.js).
   Nenhuma linha do leitor foi alterada: o conteúdo do Formatador
   já sai no formato que ele consome, então só o "moldamos" ao
   contexto — o leitor lê State.disciplina para o rótulo/eyebrow e
   a chave do accordion. Trocamos esse campo SÓ durante a chamada
   síncrona de abrirModal() e restauramos em seguida (finally),
   então State nunca fica com a disciplina "falsa".
   ============================================= */

import { State } from '../resumo-utils.js';
import { abrirModal } from '../resumo-reader.js';

const ROTULO = 'Formatador';

/* rotulo: nome do formato usado ao formatar (Resumo, Síntese…),
   mostrado no selo do leitor. */
export function abrirNoLeitor(aula, { rotulo } = {}) {
  const original = State.disciplina;
  // Mantém `arquivo`/demais campos da disciplina real (o leitor os usa
  // para resolver base de imagens); só id/nome mudam.
  State.disciplina = { ...(original ?? {}), id: 'formatador', nome: ROTULO };
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
  if (badge) badge.textContent = rotulo || ROTULO;
}