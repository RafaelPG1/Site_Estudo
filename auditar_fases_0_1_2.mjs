#!/usr/bin/env node
/* Nexus Study — verificador das Fases 1 e 2 (SOMENTE LEITURA: não altera nada).
   Uso, na raiz do repositório:   node auditar_fases_0_1_2.mjs
   Para também listar o que mudou fora do plano:  node auditar_fases_0_1_2.mjs --base <commit-ou-tag-anterior-à-Fase-1>
   Requer Node 18+. Saída com código 1 se houver alguma FALHA.
   Pastas ignoradas em toda a varredura: games, pessoal, info, nao_git, novas_implementações.
   O próprio script também é ignorado (evita falso positivo). */
import fs from 'fs'; import path from 'path'; import { execFileSync } from 'child_process'; import { fileURLToPath } from 'url';
const root = process.cwd(); const linhas = []; let falhas = 0, atencoes = 0;
const ok = m => linhas.push('  ✔ ' + m), bad = m => { falhas++; linhas.push('  ✘ FALHA: ' + m); }, warn = m => { atencoes++; linhas.push('  ! ATENÇÃO: ' + m); };
const sec = t => linhas.push('\n' + t);
const existe = p => fs.existsSync(path.join(root, p));
const ler = p => fs.readFileSync(path.join(root, p), 'utf8');
const semComent = t => t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');
const rel = f => path.relative(root, f).split(path.sep).join('/');
const eu = path.resolve(fileURLToPath(import.meta.url));
const IGNORAR = /^(games|pessoal|info|nao_git|novas_implementações)\//;
function andar(d, acc = []) {
  let itens; try { itens = fs.readdirSync(d, { withFileTypes: true }); } catch { return acc; }
  for (const e of itens) {
    if (['node_modules', '.git', '.venv'].includes(e.name)) continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (!IGNORAR.test(rel(p) + '/')) andar(p, acc); } else acc.push(p);
  }
  return acc;
}
const todos = andar(root).filter(f => /\.(js|mjs|html|css)$/.test(f) && path.resolve(f) !== eu && !IGNORAR.test(rel(f)));
function ocorrencias(re) { const r = []; for (const f of todos) ler(rel(f)).split(/\r?\n/).forEach((l, i) => { if (re.test(l)) r.push(`${rel(f)}:${i + 1}`); }); return r; }
function arq(p, descr) { if (!existe(p)) { bad(`${descr}: arquivo não encontrado em ${p} (caminho deduzido; ajuste se o seu for outro)`); return null; } return ler(p); }

sec('FASE 0 — pulada por decisão (nada a verificar no código)');
linhas.push('  · Lembrete: o GitHub guarda o CÓDIGO, mas NÃO os dados do Firestore. Exporte o Firestore antes da Fase 4.');

sec('FASE 1 — Limpezas seguras');
existe('resumo/js/formatador/formatador-reader.js') ? bad('formatador-reader.js ainda existe') : ok('formatador-reader.js removido');
const r1 = ocorrencias(/formatador-reader/); r1.length ? bad('referências a formatador-reader: ' + r1.join(', ')) : ok('nenhuma referência a formatador-reader');
let t = arq('shared/js/audio/engine/play.js', 'play.js'); if (t) /console\./.test(semComent(t)) ? bad('play.js ainda chama console.*') : ok('play.js sem console.*');
const r2 = ocorrencias(/semestre-changed/); r2.length ? bad('listener/emissor semestre-changed: ' + r2.join(', ')) : ok("nenhum 'semestre-changed'");
const r3 = ocorrencias(/__NEXUS_BACK_HREF_EARLY__/); r3.length ? bad('__NEXUS_BACK_HREF_EARLY__ em: ' + r3.join(', ')) : ok('__NEXUS_BACK_HREF_EARLY__ removida');
t = arq('dashboard/js/agenda/agenda_render.js', 'agenda_render.js'); if (t) /\btodayMonday\b/.test(t) ? bad('todayMonday ainda em agenda_render.js') : ok('todayMonday removida');
const textos = [['admin/admin_progress.js', /admin-progress\.js/, 'cabeçalho com nome errado (admin-progress)'], ['shared/js/ia/quiz/assistant_quiz.js', /quiz\/js\/assistant_quiz/, 'caminho errado no cabeçalho'], ['shared/css/themes/fundo.css', /shared\/css\/fundo\.css/, 'caminho antigo do fundo.css'], ['shared/css/themes/logo.css', /shared\/css\/logo\.css/, 'caminho antigo do logo.css'], ['shared/css/utils/quick-access.css', /tecla T[ |]/, '"tecla T" (o JS usa Tab)'], ['shared/js/audio/ui/audio-btns.js', /roxa própria|\(roxo\//, '"roxo" no comentário (a cor é azul)'], ['shared/css/audio/audio-btns.css', /Roxo escolhido/, '"Roxo" no comentário'], ['dashboard/js/checklist/checklist_storage.js', /nexus_checklist_ui/, 'chave antiga nexus_checklist_ui no comentário']];
for (const [p, re, d] of textos) { const x = arq(p, p); if (x) re.test(x) ? bad(`${p}: ${d}`) : ok(`${p}: comentário corrigido`); }

sec('FASE 2 — Sessões');
existe('shared/js/utils/session-manager.js') ? bad('session-manager.js ainda existe') : ok('session-manager.js removido');
const leg = ocorrencias(/iniciarSessao|encerrarSessao|session-manager/).filter(x => !/^(admin\/admin-sessions-model\.js|src\/session-tracker\.js):/.test(x));
leg.length ? bad('uso/menção ao legado fora dos 2 comentários documentais: ' + leg.join(', ')) : ok('legado só citado nos comentários documentais (tracker e modelo do painel)');
t = arq('index.js', 'index.js da Home'); if (t) { /session-tracker\.js/.test(t) ? ok("Home importa './src/session-tracker.js'") : bad('Home não importa o session-tracker.js'); /session-manager|iniciarSessao|encerrarSessao/.test(t) ? bad('Home ainda usa o legado') : ok('Home sem o legado'); }
t = arq('src/session-tracker.js', 'session-tracker.js'); if (t) /v11\.1/.test(t) ? ok('tracker com o cabeçalho da Fase 2 (v11.1)') : warn('cabeçalho v11.1 do tracker ausente (só comentário; não afeta o funcionamento)');
t = arq('admin/admin-sessions-model.js', 'admin-sessions-model.js'); if (t) /startedAt/.test(t) && /entrada/.test(t) ? ok('modelo do painel ainda lê o formato legado (preservado de propósito)') : warn('suporte ao formato legado parece removido: só é seguro se o inventário mostrar 0 sessões legadas');

sec('GERAL — imports e dependências');
const naoRes = []; const re = /(?:from\s+|import\s*\(\s*|^\s*import\s+)['"]([^'"]+)['"]/gm;
for (const f of todos) {
  let tx = ler(rel(f)); if (/\.m?js$/.test(f)) tx = semComent(tx);
  const refs = new Set(); for (const m of tx.matchAll(re)) refs.add(m[1]);
  if (f.endsWith('.html')) for (const m of tx.matchAll(/(?:src|href)=["']([^"']+\.(?:js|css))["']/g)) refs.add(m[1]);
  if (f.endsWith('.css')) for (const m of tx.matchAll(/@import\s+url\(['"]?([^'")]+)/g)) refs.add(m[1]);
  for (const s of refs) { if (/^(https?:|data:|\/\/)/.test(s) || !s.startsWith('.')) continue; const alvo = path.resolve(path.dirname(f), s.split('?')[0].split('#')[0]); if (!fs.existsSync(alvo) && !fs.existsSync(alvo + '.js')) naoRes.push(`${rel(f)} → ${s}`); }
}
naoRes.length ? bad(`${naoRes.length} import(s)/link(s) relativo(s) sem arquivo:\n      ` + naoRes.join('\n      ')) : ok('todos os imports/links relativos resolvem');
for (const p of ['dashboard/js/dashboard_data.js', 'dashboard/js/dashboard_render.js']) { const x = arq(p, p); if (!x) continue; const m = x.match(/from\s+['"](\.\/conquista\/[^'"]+)['"]/); if (!m) { warn(`${p}: import de Conquistas não encontrado`); continue; } existe('dashboard/js/' + m[1].slice(2)) ? ok(`${p} → ${m[1]} existe`) : bad(`${p} importa ${m[1]}, que NÃO existe (renomeio de Conquistas pendente: ver pendência P4)`); }
const baseArg = process.argv.indexOf('--base');
if (baseArg > 0) { sec('GERAL — arquivos alterados desde ' + process.argv[baseArg + 1]);
  try { const base = process.argv[baseArg + 1]; const sh = (...a) => execFileSync('git', a, { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean);
    const alt = new Map(); sh('diff', '--name-status', base).forEach(l => { const [s, ...p] = l.split('\t'); alt.set(p[p.length - 1], s); }); sh('ls-files', '--others', '--exclude-standard').forEach(p => alt.set(p, '?'));
    const previstos = new Set(['shared/js/audio/engine/play.js', 'dashboard/js/dashboard.js', 'quiz/template/template.html', 'dashboard/js/agenda/agenda_render.js', 'admin/admin_progress.js', 'shared/js/ia/quiz/assistant_quiz.js', 'shared/css/themes/fundo.css', 'shared/css/themes/logo.css', 'shared/css/utils/quick-access.css', 'shared/js/audio/ui/audio-btns.js', 'shared/css/audio/audio-btns.css', 'dashboard/js/checklist/checklist_storage.js', 'resumo/js/formatador/formatador-reader.js', 'admin/admin.js', 'dashboard/dashboard.html', 'admin/admin-sessions-model.js', 'src/session-tracker.js', 'shared/js/utils/session-manager.js', 'index.js']);
    for (const [p, s] of alt) { if (IGNORAR.test(p)) continue; if (/^(atlas|content)\//.test(p)) bad(`alteração em área FORA DE ESCOPO: ${s} ${p}`); else if (!previstos.has(p)) warn(`fora da lista das Fases 1/2: ${s} ${p} (pode ser legítimo, ex.: renomeio de Conquistas; confirme)`); }
    ok(`${alt.size} arquivo(s) alterado(s) desde a base; ${[...alt.keys()].filter(p => previstos.has(p)).length} previsto(s) pelo plano`);
  } catch (e) { warn('não consegui rodar o git: ' + e.message.split('\n')[0]); } }
console.log(linhas.join('\n') + `\n\nRESULTADO: ${falhas} falha(s), ${atencoes} atenção(ões)`); process.exit(falhas ? 1 : 0);
