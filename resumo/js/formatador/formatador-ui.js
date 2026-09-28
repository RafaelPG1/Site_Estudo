/* =============================================
   NEXUS STUDY — resumo/js/formatador/formatador-ui.js
   Marcação da tela única do Formatador:
     área principal   → Prompt (formato) e Texto (conteúdo de estudo
                        + botão "Formatar texto")
     lateral direita  → Meus conteúdos (lista preenchida por formatador.js)
   Só HTML — sem estado e sem regra de negócio.
   ============================================= */

import { esc } from '../resumo-utils.js';
import { MODELOS_PROMPT, GRUPOS_MODELO } from './formatador-prompts.js';

const ICONE_SETA = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>`;

const ICONE_COPIAR = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>`;
const ICONE_DOC = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6"/><path d="M9 17h4"/></svg>`;

function _chips() {
  return GRUPOS_MODELO.map(g => `
    <div class="fmt__grupo">
      <span class="fmt__grupo-nome">${esc(g.rotulo)}</span>
      <div class="fmt__modelos">
        ${MODELOS_PROMPT.filter(m => m.grupo === g.id).map(m =>
          `<button type="button" class="fmt__chip" data-modelo="${esc(m.id)}" aria-pressed="false" data-tip="${esc(m.desc)}">${esc(m.nome)}</button>`
        ).join('')}
      </div>
    </div>`).join('');
}

export function montarView(host) {
  host.innerHTML = `
    <div class="fmt">
     <div class="fmt__main">
      <header class="fmt__head">
        <button type="button" class="fmt__voltar" data-fmt="voltar">${ICONE_SETA}<span>Voltar ao início</span></button>
        <h1 class="fmt__titulo">Formatador</h1>
        <p class="fmt__sub">Cole o conteúdo estruturado e clique em Formatar texto. O resultado entra em Meus conteúdos e abre no leitor do Nexus.</p>
      </header>

      <div class="fmt__principal">
          <section class="fmt__bloco" aria-labelledby="fmt-h-prompt">
            <h2 class="fmt__h" id="fmt-h-prompt">Prompt</h2>
            <p class="fmt__dica">Modelos de prompt — Resumo, Resumão e Síntese são os principais — que definem como um conteúdo deve ser organizado e já trazem a estrutura de leitura do Nexus. Escolha um ou escreva o seu; pode editar à vontade.</p>
            ${_chips()}
            <p class="fmt__modelo-desc" id="fmt-modelo-desc" hidden></p>

            <label class="fmt__lbl fmt__lbl--oculto" for="fmt-instrucao">Prompt</label>
            <textarea class="fmt__area fmt__area--prompt" id="fmt-instrucao" spellcheck="false"
              placeholder="Escolha um modelo acima ou escreva o seu prompt. Se ele não trouxer a estrutura do Nexus, ela é adicionada ao final na hora de copiar."></textarea>

            <div class="fmt__acoes">
              <button type="button" class="fmt__btn" data-fmt="copiar" id="fmt-btn-copiar" data-tip="Copia só o prompt (com a estrutura do Nexus), sem o seu texto">${ICONE_COPIAR}Copiar só o prompt</button>
              <button type="button" class="fmt__btn" data-fmt="copiar-estrutura" id="fmt-btn-copiar-estrutura" data-tip="Copia somente a estrutura de saída do Nexus deste prompt, sem o restante e sem o seu texto">${ICONE_COPIAR}Copiar estrutura</button>
              <span class="fmt__status" id="fmt-status" role="status" aria-live="polite"></span>
            </div>
          </section>

          <section class="fmt__bloco" aria-labelledby="fmt-h-texto">
            <h2 class="fmt__h" id="fmt-h-texto">Texto</h2>
            <p class="fmt__dica">Cole aqui o conteúdo estruturado: o objeto com <code>aula</code>, <code>ideia_central</code> e <code>secoes</code>. O Formatador o converte em conteúdo de leitura e o título em Meus conteúdos é o valor de <code>aula</code>.</p>

            <label class="fmt__lbl fmt__lbl--oculto" for="fmt-texto">Texto</label>
            <textarea class="fmt__area fmt__area--texto" id="fmt-texto" spellcheck="false"
              placeholder='{ aula: "Título do conteúdo", ideia_central: "…", secoes: [ { id: "…", titulo: "…", blocos: [ … ] } ] }'></textarea>
            <span class="fmt__count" id="fmt-count">0 palavras · 0 caracteres</span>

            <div class="fmt__acoes">
              <button type="button" class="fmt__btn fmt__btn--forte" data-fmt="formatar" id="fmt-btn-formatar">Formatar texto</button>
              <span class="fmt__status" id="fmt-status-formatar" role="status" aria-live="polite"></span>
            </div>
          </section>
      </div>
     </div>

     <aside class="fmt__lateral" aria-labelledby="fmt-h-lista">
      <div class="fmt__lateral-in">
        <h2 class="fmt__h" id="fmt-h-lista">Meus conteúdos</h2>
        <div class="fmt__lista" id="fmt-lista">
          <div class="fmt__vazio-card">
            <span class="fmt__vazio-icone">${ICONE_DOC}</span>
            <strong class="fmt__vazio-titulo">Nenhum conteúdo ainda</strong>
            <span class="fmt__vazio-txt">Quando você formatar um texto, ele aparece aqui.</span>
          </div>
        </div>
      </div>
     </aside>
    </div>`;
}