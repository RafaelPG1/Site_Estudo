/* dashboard\js\checklist\checklist.js
 proibo de mudar o caminho, os arquivos deve ter os caminhos para saber onde estar

   Orquestrador do módulo Checklist. Ponto único de integração
   com o resto do Dashboard (importado apenas por dashboard.js).

   Responsabilidades:
     ✔ Resolver dinamicamente o caminho de checklist_data.js a
       partir do semestre selecionado (State.semestre)
     ✔ Carregar o progresso do usuário (checklist_storage.js)
     ✔ Delegar toda a renderização a checklist_renderer.js
     ✔ Persistir alterações de progresso — nunca modifica
       checklist_data.js

   REGRA DE CAMINHO (obrigatória):
     content/pessoal/{ANO}/{SEMESTRE}/checklist_data.js
   ANO é sempre extraído do próprio semestre (ex.: "2026-AP1" →
   "2026") — nunca hardcoded. Adicionar um novo semestre nunca
   exige alterar este arquivo: basta criar a pasta e o
   checklist_data.js correspondente.

   Este arquivo não lê State.intelligence, State.disciplinas ou
   qualquer outro dado da Camada 5 — é totalmente desacoplado do
   restante do Dashboard, como pedido.

   ─────────────────────────────────────────────
   DIAGNÓSTICO — 404 ao importar checklist_data.js
   ─────────────────────────────────────────────
   import() dinâmico resolve caminhos relativos com base na URL
   do MÓDULO QUE FAZ O IMPORT (import.meta.url), não com base na
   página HTML. Antes, o caminho relativo era passado direto para
   import() — funcionava, mas não dava nenhuma pista de qual URL
   absoluta o navegador realmente tentou buscar quando o arquivo
   não existia (o erro só mostra "Failed to fetch dynamically
   imported module: <url>", já tarde demais para comparar com o
   disco antes da tentativa).
   Agora a URL absoluta é calculada explicitamente via
   `new URL(caminhoRelativo, import.meta.url)` ANTES do import, e
   sempre logada no console — inclusive em caso de sucesso — para
   que seja trivial comparar com a estrutura real de pastas do
   projeto. O caminho relativo em si (contagem de "../") não foi
   alterado: apenas a forma de resolvê-lo e reportá-lo. */

import { State } from '../dashboard_data.js';
import { getUsuario } from '../../../../src/global.js';
import { carregarProgresso, salvarItem } from './checklist_storage.js';
import { renderChecklist, renderEstadoVazio } from './checklist_renderer.js';

let _viewAberta   = false;
let _geracaoAtual = 0; // guarda de geração — mesma técnica de dashboard_data.js

export function checklistEstaAberta() {
  return _viewAberta;
}

function _resolverCaminhoDados(semestre) {
  const ano = String(semestre ?? '').slice(0, 4);
  return `../../../../content/pessoal/${ano}/${semestre}/checklist_data.js`;
}

async function _importarDadosSemestre(semestre) {
  const caminhoRelativo = _resolverCaminhoDados(semestre);

  /* URL absoluta real que o navegador vai buscar — calculada
     ANTES da tentativa, para aparecer no console mesmo se o
     import falhar. Compare esta URL exata com o arquivo no disco
     (copie e cole no navegador para testar diretamente). */
  const urlAbsoluta = new URL(caminhoRelativo, import.meta.url).href;
  console.log(`[checklist] Semestre "${semestre}" → tentando carregar:`, urlAbsoluta);

  try {
    const mod = await import(caminhoRelativo);
    if (!mod || !('checklistData' in mod)) {
      console.warn(
        `[checklist] O arquivo foi encontrado em ${urlAbsoluta}, mas não exporta "checklistData". ` +
        `Verifique se o arquivo usa "export const checklistData = { ... }".`
      );
      return null;
    }
    console.log(`[checklist] checklist_data.js carregado com sucesso para "${semestre}".`);
    return mod.checklistData ?? null;
  } catch (err) {
    /* Duas causas bem diferentes acabam caindo aqui — logadas
       separadamente para facilitar o diagnóstico:
         1) Arquivo realmente não existe nesse caminho (404) —
            problema de disco/nome de pasta, não de código.
         2) Arquivo existe, mas tem erro de sintaxe/import quebrado
            dentro dele — o navegador também reporta como falha de
            import dinâmico, mas a causa é outra. */
    console.warn(
      `[checklist] Falha ao importar checklist_data.js para "${semestre}".\n` +
      `URL tentada: ${urlAbsoluta}\n` +
      `Se abrir essa URL direto no navegador e der 404: o arquivo não está nesse caminho no disco ` +
      `(confira maiúsculas/minúsculas, extensão .js e o nome exato da pasta do semestre).\n` +
      `Se abrir e mostrar o conteúdo do arquivo: pode ser cache do servidor local — reinicie o Live Server.\n` +
      `Se abrir e der erro de JS: há um problema de sintaxe dentro do próprio checklist_data.js.`,
      err
    );
    return null;
  }
}

/* Chamado por dashboard.js sempre que:
     - o usuário clica em "Checklist" (sidebar ou grade de
       ferramentas)
     - o semestre é trocado enquanto a view já está aberta */
export async function abrirChecklist(containerEl) {
  if (!containerEl) return;
  _viewAberta = true;

  const minhaGeracao = ++_geracaoAtual;
  const semestre = State.semestre;

  if (!semestre) {
    renderEstadoVazio(containerEl, 'Selecione um semestre para ver o checklist.');
    return;
  }

  containerEl.innerHTML = `<div class="checklist-loading">Carregando checklist…</div>`;

  const [checklistData, progresso] = await Promise.all([
    _importarDadosSemestre(semestre),
    (async () => {
      const usuario = getUsuario?.();
      return carregarProgresso(usuario?.uid ?? null, semestre);
    })(),
  ]);

  /* Guarda de geração: se o semestre mudou de novo (ou a view foi
     fechada) enquanto esperávamos, esta resposta antiga não deve
     sobrescrever o que já está na tela. */
  if (minhaGeracao !== _geracaoAtual) return;

  if (!checklistData) {
    const ano = String(semestre).slice(0, 4);
    renderEstadoVazio(
      containerEl,
      `Nenhum checklist configurado para o semestre ${semestre} ainda. Crie o arquivo content/pessoal/${ano}/${semestre}/checklist_data.js para habilitá-lo. (Veja o console para o caminho exato que foi tentado.)`
    );
    return;
  }

  renderChecklist(containerEl, checklistData, progresso, semestre, (itemId, concluido) => {
    const usuario = getUsuario?.();
    salvarItem(usuario?.uid ?? null, semestre, itemId, concluido).catch(() => {});
  });
}

/* Chamado por dashboard.js ao voltar para a view padrão do
   Dashboard. Não há limpeza necessária hoje (o container só é
   ocultado, não destruído) — o ponto de saída existe para manter
   simetria com abrirChecklist() e permitir extensão futura sem
   tocar em dashboard.js. */
export function fecharChecklist() {
  _viewAberta = false;
}