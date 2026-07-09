/* dashboard\js\checklist\checklist.js
 proibo de mudar o caminho, os arquivos deve ter os caminhos para saber onde estar

   Orquestrador do módulo Checklist. Ponto único de integração
   com o resto do Dashboard (importado apenas por dashboard.js).

   Responsabilidades:
     ✔ Resolver dinamicamente o caminho de checklist_data.js a
       partir do semestre selecionado (State.semestre)
     ✔ Carregar o progresso do usuário (checklist_storage.js)
     ✔ Carregar/salvar o estado de UI dos accordions — quais
       disciplinas/categorias estão recolhidas (checklist_storage.js)
     ✔ Validar as disciplinas do checklist contra a lista OFICIAL
       do semestre (getDisciplinasDeSemestre) — ver Fase "Disciplinas
       oficiais" abaixo
     ✔ Delegar toda a renderização a checklist_renderer.js
     ✔ Persistir alterações de progresso — nunca modifica
       checklist_data.js

   REGRA DE CAMINHO (obrigatória):
     content/pessoal/{ANO}/{SEMESTRE}/checklist_data.js
   ANO é sempre extraído do próprio semestre (ex.: "2026-AP1" →
   "2026") — nunca hardcoded. Adicionar um novo semestre nunca
   exige alterar este arquivo: basta criar a pasta e o
   checklist_data.js correspondente.
   IMPORTANTE: este caminho continua indexado pelo SEMESTRE COMPLETO
   (ex.: "2026.1-AP2"), não pelo período-base — porque o CONTEÚDO
   do checklist (tarefas/itens) é diferente entre AP1 e AP2, mesmo
   que as disciplinas sejam as mesmas. Só a lista de disciplinas é
   compartilhada entre AP1/AP2; os itens continuam por semestre.

   ─────────────────────────────────────────────
   DISCIPLINAS OFICIAIS — fonte única de verdade (obrigatório)
   ─────────────────────────────────────────────
   O Checklist NUNCA aceita disciplinas arbitrárias. checklist_data.js
   não declara nome/emoji de disciplina — apenas referencia um
   `disciplinaId` e a lista de CATEGORIAS daquela disciplina (ex.:
   "Aulas", "Exercícios", "Projeto"), cada categoria com seus itens.
   Isso é conteúdo/estrutura interna do checklist, livre para o autor
   de cada checklist_data.js organizar como quiser — só a disciplina-
   -mãe é validada. Quem diz quais disciplinas existem (nome, emoji, cor)
   em cada semestre é
   SEMPRE getDisciplinasDeSemestre() (src/global.js) — a MESMA fonte
   já usada pelo restante do Dashboard (disc-grid, sidebar, cores de
   tema). Isso evita ter duas listas de disciplinas divergentes.

   getDisciplinasDeSemestre() já recebe o semestre completo (ex.:
   "2026.1-AP2") e resolve internamente o período-base (2026.1) —
   é por isso que AP1 e AP2 já mostram as mesmas disciplinas em
   outras partes do Dashboard. O Checklist reaproveita exatamente
   essa mesma chamada, sem reimplementar a regra "AP1/AP2 = mesmas
   disciplinas" — reimplementar seria criar uma segunda fonte de
   verdade, o que é exatamente o que este módulo deve evitar.

   _mesclarComDisciplinasOficiais() cruza checklistData.disciplinas
   (só disciplinaId + itens) com a lista oficial (id + nome + emoji):
     - disciplinaId que existe oficialmente  → aparece no Checklist,
       com nome/emoji vindos da fonte oficial (nunca de
       checklist_data.js)
     - disciplinaId que NÃO existe oficialmente naquele semestre →
       descartado silenciosamente da UI, com aviso no console (não
       quebra a tela, só não é exibido — não existe "disciplina
       arbitrária" possível)

   ─────────────────────────────────────────────
   ESTADO DE UI DOS ACCORDIONS — persistência por semestre
   ─────────────────────────────────────────────
   Quais disciplinas/categorias estão recolhidas é lido de
   checklist_storage.js (carregarEstadoUI) ANTES de chamar
   renderChecklist(), e passado a ela como estado inicial — assim
   um F5 restaura exatamente o que estava aberto/fechado. Toda vez
   que o usuário expande/recolhe algo, checklist_renderer.js chama
   o callback abaixo (onMudarEstadoUI), que apenas repassa para
   salvarEstadoUI(semestre, estadoUI). Este arquivo não guarda
   esse estado em memória — cada leitura/escrita passa direto por
   checklist_storage.js, que já usa o mesmo localStorage do
   progresso (chave própria, por semestre, sem misturar com
   progresso nem com outros semestres).

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
import { getUsuario, getDisciplinasDeSemestre } from '../../../src/global.js';
import { carregarProgresso, salvarItem, carregarEstadoUI, salvarEstadoUI } from './checklist_storage.js';
import { renderChecklist, renderEstadoVazio } from './checklist_renderer.js';

let _viewAberta   = false;
let _geracaoAtual = 0; // guarda de geração — mesma técnica de dashboard_data.js

export function checklistEstaAberta() {
  return _viewAberta;
}

function _resolverCaminhoDados(semestre) {
  const ano = String(semestre ?? '').slice(0, 4);
  return `../../../content/pessoal/${ano}/${semestre}/checklist_data.js`;
}

/* Cruza as disciplinas declaradas em checklist_data.js (apenas
   `disciplinaId` + `categorias`) com a lista OFICIAL de disciplinas
   do semestre (getDisciplinasDeSemestre). Nome, emoji e ordem da
   DISCIPLINA sempre vêm da fonte oficial — nunca do checklist_data.js.
   `categorias` (Aulas/Exercícios/Projeto/...) e seus `itens` são
   conteúdo próprio do checklist e passam direto — este módulo não
   impõe categorias fixas, só valida a disciplina-mãe.

   Qualquer disciplinaId que não exista oficialmente no semestre é
   descartado da exibição (não é um erro fatal: apenas não aparece),
   com aviso no console para facilitar detectar checklist_data.js
   desatualizados (ex.: disciplina renomeada/removida do semestre). */
function _mesclarComDisciplinasOficiais(checklistData, disciplinasOficiais, semestre) {
  const oficiaisPorId = new Map((disciplinasOficiais ?? []).map(d => [d.id, d]));
  const disciplinasChecklist = checklistData?.disciplinas ?? [];

  const mescladas = [];

  disciplinasChecklist.forEach(discChecklist => {
    const oficial = oficiaisPorId.get(discChecklist.disciplinaId);

    if (!oficial) {
      console.warn(
        `[checklist] Disciplina "${discChecklist.disciplinaId}" não existe na lista oficial ` +
        `do semestre "${semestre}" (getDisciplinasDeSemestre) — ignorada na exibição. ` +
        `Verifique se o disciplinaId em checklist_data.js está correto ou se a disciplina ` +
        `ainda está cadastrada para este semestre.`
      );
      return;
    }

    const categorias = (discChecklist.categorias ?? []).map(cat => ({
      id:    cat.id,
      nome:  cat.nome,
      itens: cat.itens ?? [],
    }));

    mescladas.push({
      id:    oficial.id,
      nome:  oficial.nome,
      emoji: oficial.emoji ?? null,
      categorias,
    });
  });

  return mescladas;
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

  const [checklistDataBruto, progresso] = await Promise.all([
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

  if (!checklistDataBruto) {
    const ano = String(semestre).slice(0, 4);
    renderEstadoVazio(
      containerEl,
      `Nenhum checklist configurado para o semestre ${semestre} ainda. Crie o arquivo content/pessoal/${ano}/${semestre}/checklist_data.js para habilitá-lo. (Veja o console para o caminho exato que foi tentado.)`
    );
    return;
  }

  /* Fonte única de verdade das disciplinas: a MESMA função já usada
     por dashboard.js para o disc-grid/sidebar/cores. O Checklist
     nunca declara disciplinas por conta própria. */
  const disciplinasOficiais = getDisciplinasDeSemestre(semestre) ?? [];
  const disciplinasMescladas = _mesclarComDisciplinasOficiais(
    checklistDataBruto, disciplinasOficiais, semestre
  );

  if (disciplinasMescladas.length === 0) {
    renderEstadoVazio(
      containerEl,
      `Nenhuma disciplina do checklist deste semestre corresponde às disciplinas oficiais de ${semestre}. ` +
      `Verifique os campos "disciplinaId" em checklist_data.js (veja o console para detalhes).`
    );
    return;
  }

  const checklistDataValidado = { disciplinas: disciplinasMescladas };

  /* Estado de UI dos accordions (quais disciplinas/categorias estão
     recolhidas) — lido do mesmo semestre, ANTES de renderizar, para
     que a primeira pintura na tela já saia exatamente como o
     usuário deixou (sem "piscar" tudo aberto e depois recolher). */
  const estadoUISalvo = carregarEstadoUI(semestre);

  renderChecklist(
    containerEl,
    checklistDataValidado,
    progresso,
    semestre,
    (itemId, concluido) => {
      const usuario = getUsuario?.();
      salvarItem(usuario?.uid ?? null, semestre, itemId, concluido).catch(() => {});
    },
    estadoUISalvo,
    (estadoUI) => {
      salvarEstadoUI(semestre, estadoUI);
    }
  );
}

/* Chamado por dashboard.js ao voltar para a view padrão do
   Dashboard. Não há limpeza necessária hoje (o container só é
   ocultado, não destruído) — o ponto de saída existe para manter
   simetria com abrirChecklist() e permitir extensão futura sem
   tocar em dashboard.js. */
export function fecharChecklist() {
  _viewAberta = false;
}