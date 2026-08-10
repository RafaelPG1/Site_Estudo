/* =============================================
   NEXUS STUDY — src/perf_logger.js

   Utilitário de INSTRUMENTAÇÃO de performance.
   ─────────────────────────────────────────────
   Este arquivo NÃO contém nenhuma regra de negócio.
   Apenas mede e registra tempos, para diagnóstico.
   Pode ser removido/desativado sem afetar nenhum
   comportamento funcional do sistema.

   Uso típico:
     perfLog('categoria', 'label', ms, { extra: 1 })
     logFirestore('colecao/doc', uid, ms, qtdDocs)
     logCache('label', true/false, ms)
     logDom('label', ms, { criados: 10 })

   Relatório automático:
     No console do navegador, após o Dashboard
     terminar de carregar, chame:
       __nexusPerfReport()
     Isso imprime o ranking completo, tempo total
     por categoria, tempo total em Firestore, tempo
     em renderização, tempo em loops, tempo em
     Promise.all e estatística de cache HIT/MISS.

     __nexusPerfClear() zera os registros acumulados
     (útil para medir só um ciclo de carregamento).

   ─────────────────────────────────────────────
   INSTRUMENTAÇÃO DESLIGADA POR PADRÃO (ruído no console)
   ─────────────────────────────────────────────
   `_ativo` era `true` fixo — todo `perfLog`/`logFirestore`/
   `logCache`/`logDom` chamado por QUALQUER módulo (dashboard_data.js,
   session-tracker.js etc.) imprimia uma linha `[PERF] ...` no
   console a cada chamada, mesmo fora de qualquer investigação ativa.
   Isso é o que gerava as linhas
     [PERF] Firestore :: usuarios/{uid}/perfil_uso/global :: ...ms
     [PERF] Sessão :: getStats (síncrono) :: ...ms
   vistas no console em uso normal.

   Agora `_ativo` é `false` por padrão: todas as funções de log
   (perfLog, logFirestore, logCache, logDom) continuam existindo
   com a MESMA assinatura — nenhum import em outro arquivo quebra —
   mas retornam imediatamente sem imprimir nada nem acumular
   registros enquanto `_ativo` for `false`. `medirAsync`/`medirSync`
   continuam executando a função medida normalmente (o valor de
   retorno não muda), só o log em si é suprimido.

   Para reativar temporariamente uma investigação de performance,
   basta trocar `_ativo` para `true` de novo — nenhuma outra
   alteração é necessária em nenhum outro módulo. `__nexusPerfReport()`
   e `__nexusPerfClear()` continuam expostos no console, mas com
   `_ativo = false` o relatório fica vazio (nenhuma medição para
   agregar) até a instrumentação ser religada.
   ============================================= */

const _ativo = false; // instrumentação desligada — reative para investigar performance

const _registros = [];

function _fmt(ms) {
  return `${ms.toFixed(1)}ms`;
}

function _registrar(categoria, label, ms, extra) {
  _registros.push({ categoria, label, ms, extra, ts: Date.now() });
}

/* ── Log genérico ── */
export function perfLog(categoria, label, ms, extra = {}) {
  if (!_ativo) return;
  _registrar(categoria, label, ms, extra);
  const partes = [`[PERF] ${categoria} :: ${label} :: ${_fmt(ms)}`];
  Object.entries(extra).forEach(([k, v]) => partes.push(`${k}=${v}`));
  console.log(partes.join(' | '));
}

/* ── Marcadores manuais (para blocos que não são função isolada) ── */
export function perfMark() {
  return performance.now();
}

/* ── Wrapper para funções assíncronas ── */
export async function medirAsync(categoria, label, fn, extraFn = null) {
  const t0 = performance.now();
  try {
    const resultado = await fn();
    const dt = performance.now() - t0;
    perfLog(categoria, label, dt, extraFn ? extraFn(resultado) : {});
    return resultado;
  } catch (err) {
    perfLog(categoria, `${label} (ERRO)`, performance.now() - t0);
    throw err;
  }
}

/* ── Wrapper para funções síncronas ── */
export function medirSync(categoria, label, fn) {
  const t0 = performance.now();
  const resultado = fn();
  perfLog(categoria, label, performance.now() - t0);
  return resultado;
}

/* ── Log especializado — Firestore ── */
export function logFirestore(colecaoOuDoc, uidOuDocId, ms, qtdDocs) {
  perfLog('Firestore', colecaoOuDoc, ms, { ref: uidOuDocId ?? '—', docs: qtdDocs ?? 0 });
}

/* ── Log especializado — Cache ── */
export function logCache(label, hit, ms) {
  perfLog('Cache', label, ms, { status: hit ? 'HIT' : 'MISS' });
}

/* ── Log especializado — DOM ── */
export function logDom(label, ms, extra = {}) {
  perfLog('DOM', label, ms, extra);
}

/* ── Relatório final agregado ── */
export function gerarRelatorioPerf() {
  const porCategoria = {};
  let tempoFirestore     = 0;
  let leiturasFirestore  = 0;
  let tempoRender        = 0;
  let tempoLoop          = 0;
  let tempoPromiseAll    = 0;
  let tempoDom           = 0;
  let cacheHits          = 0;
  let cacheMiss          = 0;

  _registros.forEach(r => {
    porCategoria[r.categoria] = (porCategoria[r.categoria] ?? 0) + r.ms;
    if (r.categoria === 'Firestore')   { tempoFirestore += r.ms; leiturasFirestore++; }
    if (r.categoria === 'Render')      tempoRender += r.ms;
    if (r.categoria === 'Loop')        tempoLoop += r.ms;
    if (r.categoria === 'Promise.all') tempoPromiseAll += r.ms;
    if (r.categoria === 'DOM')         tempoDom += r.ms;
    if (r.categoria === 'Cache') {
      if (r.extra?.status === 'HIT') cacheHits++;
      else cacheMiss++;
    }
  });

  const ranking = [..._registros]
    .filter(r => r.categoria !== 'Firestore')
    .sort((a, b) => b.ms - a.ms)
    .slice(0, 30);

  const rankingFirestore = [..._registros]
    .filter(r => r.categoria === 'Firestore')
    .sort((a, b) => b.ms - a.ms);

  console.group('%c[PERF] RELATÓRIO FINAL — Dashboard Nexus Study', 'font-weight:bold;font-size:14px;color:#6C63FF');
  console.log('Total de medições registradas:', _registros.length);
  console.log('Tempo total em Firestore:', tempoFirestore.toFixed(1), 'ms', `(${leiturasFirestore} leituras)`);
  console.log('Tempo total em Renderização:', tempoRender.toFixed(1), 'ms');
  console.log('Tempo total em Loops/processamento:', tempoLoop.toFixed(1), 'ms');
  console.log('Tempo total aguardando Promise.all:', tempoPromiseAll.toFixed(1), 'ms');
  console.log('Tempo total em manipulação de DOM:', tempoDom.toFixed(1), 'ms');
  console.log('Cache — HIT:', cacheHits, '| MISS:', cacheMiss);
  console.log('Tempo acumulado por categoria:', porCategoria);

  console.group('Ranking geral (30 mais lentos, exceto Firestore individual)');
  ranking.forEach((r, i) => console.log(`${i + 1}º — [${r.categoria}] ${r.label} — ${r.ms.toFixed(1)}ms`, r.extra));
  console.groupEnd();

  console.group('Ranking Firestore (todas as consultas, da mais lenta à mais rápida)');
  rankingFirestore.forEach((r, i) => console.log(`${i + 1}º — ${r.label} — ${r.ms.toFixed(1)}ms`, r.extra));
  console.groupEnd();

  console.groupEnd();

  return {
    registros: _registros.slice(),
    porCategoria,
    tempoFirestore,
    leiturasFirestore,
    tempoRender,
    tempoLoop,
    tempoPromiseAll,
    tempoDom,
    cacheHits,
    cacheMiss,
    ranking,
    rankingFirestore,
  };
}

export function limparRegistrosPerf() {
  _registros.length = 0;
  if (_ativo) console.log('[PERF] registros limpos.');
}

if (typeof window !== 'undefined') {
  window.__nexusPerfReport = gerarRelatorioPerf;
  window.__nexusPerfClear  = limparRegistrosPerf;
}