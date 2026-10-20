# Games/ — integração com a estrutura atual do Firebase (relatório)

Como aplicar: apague a pasta `Games/` antiga do projeto e coloque esta `Games/` no lugar
(ou copie por cima: os arquivos não listados abaixo são idênticos aos seus). Nada foi publicado.

## Arquivos
| Situação | Arquivo | Por quê |
|---|---|---|
| CRIADO | `template/auth-gate.js` | Porta de autenticação: `resolverUid()` (uid da sessão verificada ou `visitante`) e `sessaoAutenticada(uid)` (só libera o Firestore com sessão válida e uid igual ao logado). Só lê o estado de `src/global.js` e `src/data/firebase-app.js`. |
| MODIFICADO | `template/storage-base.js` | Todo acesso ao Firestore passa pela porta. SDK/`getDb` vêm de `src/data/firebase-app.js`. Novo: patch "pendente" (`<chave>__pend`) quando não foi possível gravar; é enviado na próxima carga/gravação autenticada (antes, a carga seguinte sobrescrevia o local e o progresso offline sumia). `salvarMerge` devolve true/false. `limpar` sem sessão não apaga nada. |
| MODIFICADO | `jogos/show_milhao/storage_sm.js` | Mesma porta para histórico e pontuações; fila de pontuações pendentes (sem duplicar); `arrayUnion` segue importado da mesma URL do SDK (10.12.0) porque `firebase-app.js` não o reexporta (evita mexer fora de Games/). |
| MODIFICADO | `jogos/flashcard/flashcard.js` | Caminho do banco corrigido: `content/game/flashcards/cards_data.js` (inexistente; quebrava o módulo inteiro) → `content/games/flashcards/{ano}/cards_data.js`, ano validado (4 dígitos). uid vem do auth-gate; `?user=` deixou de ser lido. |
| MODIFICADO | `jogos/flashcard/flashcard.html` | Script anti-flash não lê mais `?user=`; usa o usuário em cache (`nexus_usuario`) só como dica visual. |
| MODIFICADO | `jogos/vdd_falso/vdd_falso.js`, `jogos/completar_frase/completar_frase.js` | `content/game/` → `content/games/` (o erro era engolido e mostrava "banco vazio"); ano validado; uid via auth-gate. |
| MODIFICADO | `jogos/show_milhao/show_milhao.js` | uid via auth-gate; ano validado. |
| MODIFICADO | `jogos/associacao/associacao.js` | uid via auth-gate (antes `getUsuario()` síncrono); visitante continua sem gravar histórico; erro de gravação não afeta o jogo. |
| MODIFICADO | `jogos/associacao/associacao_data.js` | Só o comentário do cabeçalho (caminho). |
| MODIFICADO | `jogo.js` | A página de jogos NÃO abria: importava `mountMusicBtn` e `getMusicMode`, que não existem mais em `shared/js/audio/audio-api.js`. Removidos (o botão de som continua vindo de `Sound.init()`). |
| Renomeados / excluídos | — | nenhum |
| Inalterados | todos os `.css`, demais `.html`, `deck.js`, `game-shell.*`, `session-nav.js`, `storage.js`, `storage_cf.js`, `storage_vf.js`, `storage_a.js`, `*.ui.js` | funcionam com a base nova sem mudança. |

## Como ficou a integração
- Identidade = sessão verificada do Firebase (`sessaoVerificada` de `src/global.js`), nunca URL nem só o cache do localStorage.
- O Firestore só é chamado com sessão viva e `currentUser.uid === uid`. Sem isso (visitante, cache velho, outro uid, conta sem `nx`, `troca` pendente, logout no meio do jogo) o jogo segue só com localStorage, sem erro e sem tentativa de rede.
- Caminhos/coleções não mudaram: `usuarios/{uid}/{srs_perfis|cf_historico|vf_historico|assoc_historico|sm_historico|sm_pontuacoes}/{doc}`, todos já cobertos pelo seu `firestore.rules` (≤ 500 campos; os maiores bancos têm 30 itens).

## Testes (o que foi cada tipo)
Nenhum foi feito com login real nem contra o Firebase real. O emulador oficial do Firestore não pôde ser baixado aqui (rede bloqueada).
- **Automatizados estáticos (reais):** sintaxe de todos os `.js`; 81 referências relativas resolvidas; 139 imports nomeados conferidos contra os exports reais (0 ausentes; no código antigo: 2 ausentes, em `jogo.js`).
- **Simulados (Chromium/Playwright com SDK do Firebase FALSO em memória + simulação das regras do `firestore.rules`, rodando o código real do site e dos jogos):** 44/44 verificações — cada jogo abre sem erro JS e carrega o banco do caminho novo; Auth restaurado com 800 ms de atraso sem nenhuma operação recusada; 5 cenários sem sessão válida com 0 acessos ao Firestore; `?user=bob` ignorado; jogada real de V/F e de flashcard gravando no caminho aceito; offline → pendente → sincroniza; logout no meio do jogo; pontuação do Show do Milhão sem duplicar; limpar. A mesma suíte contra o código ANTIGO falha (bancos 404, recusa "Missing or insufficient permissions", progresso offline perdido).
- **Reais:** nenhum.
- Hub (`jogo.html`) abre sem erro e lista os 5 jogos (simulado). Show do Milhão e Complete a Frase foram exercitados na abertura e no armazenamento; a jogada completa pela interface foi feita só em V/F e flashcard.

## O que depende de você
1. **Teste real:** abra cada jogo logado (Live Server, Ctrl+F5), jogue uma rodada e confira no Firebase Console que o documento em `usuarios/<uid>/…` apareceu. Só assim o login real fica comprovado.
2. **Decisão (não alterei):** o botão "Limpar SRS" do hub (`jogo.js` → `invalidarCacheSRS`) só limpa a memória da página; não apaga o SRS no Firestore nem no localStorage, embora mostre "SRS apagado". Corrigir apagaria dados do usuário; preciso do seu OK (e se vale para todas as disciplinas ou só a escolhida).
3. **Fora de `Games/` (não alterei):** em `src/data/colecoes.js`, `SUBCOLECOES_REMOCAO_ADMIN` não lista `cf_historico` e `vf_historico`; ao remover um usuário pelo admin esses dados ficam órfãos. Correção sugerida: acrescentar os dois nomes à lista. Preciso da sua autorização.
4. Cabeçalhos de `content/games/**/*.js` ainda citam `content/game/…` (só comentário, fora de `Games/`).
