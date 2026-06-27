🐛 Bugs
Bugs encontrados
Crítico
1. Função fantasma: _srMontarDeck vs _srMontarDeck_com
_srMontarDeck(discId) usa _estado.cardsData diretamente (linha 113), mas é chamada apenas em _reiniciar() (linha 885) — momento em que _estado já está populado, então funciona por acidente.

Porém existe uma segunda versão _srMontarDeck_com(cardsData, discId) (linha 1010) com lógica idêntica, duplicada inteiramente só para receber cardsData como parâmetro em initCards(). Não é apenas duplicação: as duas podem divergir silenciosamente em futuras edições.
Fix: Remover _srMontarDeck e usar apenas _srMontarDeck_com, passando _estado.cardsData onde necessário:
- _estado.cards = _srMontarDeck(_estado.discId);

+ _estado.cards = _srMontarDeck_com(_estado.cardsData, _estado.discId);
Crítico
2. _autoInit dispara após o DOM já estar pronto
_autoInit() (linha 1063) é uma IIFE que roda imediatamente no parse do módulo ES6. O elemento #card-root pode ainda não existir nesse momento.
Ela então registra um listener 'DOMContentLoaded' — mas como o script é type="module", o HTML já está totalmente parseado quando módulos executam. DOMContentLoaded nunca mais dispara. initCards nunca é chamado no fluxo standalone.
- document.addEventListener('DOMContentLoaded', () => {

-   initCards(disc, root, usuario);

- });

+ initCards(disc, root, usuario);
Crítico
3. isUltimo com condição redundante que nunca é falsa
Linha 598: const isUltimo = current >= cards.length || (current === cards.length && todosRespondidos).
A segunda parte (current === cards.length && ...) já está coberta pela primeira (current >= cards.length). A checagem é inútil e mascara a intenção real do código.

Na linha 604: if (isUltimo && todosRespondidos) — se isUltimo for verdadeiro mas todosRespondidos for falso, entra no bloco da linha 613 que reatribui _estado.current sem limpar o #cards-bottom previamente oculto, causando layout inconsistente.
- const isUltimo = current >= cards.length || (current === cards.length && todosRespondidos);

+ const isUltimo = todosRespondidos;
Crítico
4. Undo não reverte o SRS no Firestore
_desfazer() (linha 280) restaura _srCache em memória, mas não chama salvarPerfilSRS(). O cache local está correto, mas o Firestore ainda tem o perfil do estado após a marcação. Se o usuário recarregar a página, o undo é perdido.
  if (snapshot.srPerfilAnterior) {

    const { cardId, perfil } = snapshot.srPerfilAnterior;

    _srCache[cardId] = perfil;

+   const uid = typeof _estado.nomeUsuario === 'object'

+     ? _estado.nomeUsuario.uid : _estado.nomeUsuario;

+   salvarPerfilSRS(uid, cardId, perfil, _estado.discId, _estado.semestre);

  }
Crítico
5. respostaTxt injetado sem escape no innerHTML
Linha 405: ${respostaTxt} é injetado diretamente no innerHTML da face traseira do card sem passar por _esc(). Todos os outros campos (pergunta, categoria, dica) usam _esc() corretamente. Se o conteúdo vier de fonte externa ou for editável, isso é XSS.
- <div class="cards-answer" id="cards-answer">${respostaTxt}</div>

+ <div class="cards-answer" id="cards-answer">${_esc(respostaTxt)}</div>
Ressalva: se respostaTxt for HTML intencional (formatação rich), use uma allowlist de tags seguras em vez de _esc completo.
⚠️ Problemas
Problemas potenciais
Médio
6. Race condition em _marcar() com setTimeout
_estado.marcando = false só é resetado dentro do setTimeout de 700ms (linha 851). Se o usuário clicar no botão antes do timeout acabar, o guard if (_estado.marcando) return protege — mas os botões são reabilitados (disabled = false) sem checar se outro clique está em andamento. Em dispositivos lentos com cliques rápidos, a animação pode ser interrompida.
Médio
7. _srAtualizar acessa _estado globalmente de forma implícita
_srAtualizar() lê _estado.nomeUsuario, _estado.discId e _estado.semestre diretamente do escopo global (linhas 102–105). Isso cria acoplamento oculto — a função parece pura mas depende de estado externo. Se chamada fora do contexto de uma sessão ativa (ex: em testes), vai lançar erros silenciosos.
Médio
8. _srEstatisticas mescla "dominado" e "em dia" no mesmo contador
Linha 167: else if (p.dominado || p.proximaVez > agora) dominados++. Cards que ainda não são dominados mas têm revisão futura são contados como "dominados" na tela final. O texto exibe "X de Y cards dominados" mas o número está inflado.
- else if (p.dominado || p.proximaVez > agora) dominados++;

+ else if (p.dominado) dominados++;
Médio
9. Dots de navegação criam closures sobre _estado.current stale
Em _atualizarDots() (linha 777), o handler de click compara i > _estado.current no momento do click — mas se _estado mudar entre o render dos dots e o click, a referência pode estar correta. Porém os dots são recriados via innerHTML = '' em toda chamada a _atualizarUI() (linha 743), o que remove e recria os listeners constantemente. Isso é custoso e pode causar flicker em decks grandes.
Baixo
10. _salvarSessao serializa historico: undefined mas sessionStorage guarda null
Linha 213: historico: undefined — JSON.stringify omite propriedades undefined. Ao restaurar a sessão em initCards(), sessaoSalva.historico será undefined. O código não usa esse campo na restauração, então não quebra, mas o comentário diz "descarta ao salvar" sem documentar a intenção de não restaurar o histórico de undo.
Baixo
11. _marcarDificuldade não bloqueia antes de virar o card
Os atalhos de teclado 1/2/3 só disparam _marcarDificuldade se flipped === true (linha 248). Mas os botões diff na face traseira não têm essa guarda — são renderizados sempre. Se o card não estiver virado (estado inconsistente de alguma forma), os botões ficam clicáveis sem efeito visual adequado.
🚀 Melhorias
Melhorias opcionais
Extrair resolução de UID para uma função utilitária
O padrão typeof nomeUsuario === 'object' ? nomeUsuario.uid : nomeUsuario aparece em 3 lugares diferentes (linhas 102, 955, 1068). Extraia para function _resolverUid(u) { return typeof u === 'object' ? u?.uid : u; }.
Dots: usar diff em vez de recriar tudo
Substituir dotsRow.innerHTML = '' + loop de criação por uma atualização de classes nos botões existentes. Reduz thrashing do DOM e elimina os re-registros de listeners.
storage.js: logs de debug em produção
console.log('[_docRef] valores:', ...) e console.log('[_docRef] getDb():', ...) (storage.js linhas 8–9) estão em produção. Remova ou condicione a uma flag de ambiente.

Resumo dos achados por prioridade:
5 bugs críticos que causam comportamento incorreto real:
O mais perigoso é o bug #2 — em type="module", o DOMContentLoaded já disparou antes do script ser executado, então a _autoInit nunca chama initCards no fluxo standalone. O jogo simplesmente não inicializa.
Em seguida, o bug #4 (undo não persiste no Firestore) é grave porque o usuário desfaz uma resposta, recarrega a página e vê o estado antigo — parece que o undo foi ignorado.
O bug #5 (XSS em respostaTxt) depende da origem dos dados: se vier de um banco editável por usuários, é uma superfície de ataque.
6 problemas potenciais relevantes, sendo o #8 o mais visível para o usuário final — o contador "cards dominados" na tela de conclusão inclui cards que ainda não foram dominados mas têm revisão futura, inflando o número exibido.






Agora tenho o código completo. Vou aplicar todas as correções:Copy file to working directoryCopy file to working directoryBug #1 — Remover _srMontarDeck e usar apenas _srMontarDeck_com:Editou 2 arquivosEditou 2 arquivosBug #2 — _autoInit com DOMContentLoaded que nunca dispara em módulos ES6:Bug #2: Fix _autoInit — in ES modules DOMContentLoaded already fired, call initCards directlyBug #2: Fix _autoInit — in ES modules DOMContentLoaded already fired, call initCards directlyBug #3 — isUltimo com condição redundante e layout inconsistente:Bug #3: Fix isUltimo to depend solely on todosRespondidos; fix layout when isUltimo but not all answeredBug #3: Fix isUltimo to depend solely on todosRespondidos; fix layout when isUltimo but not all answeredNow fix the block after isUltimo that hides #cards-bottom before reassigning current — ensure it only runs when !isUltimo:Bug #3: Ensure the out-of-bounds current correction only runs when not isUltimo, and bottom is shownBug #3: Ensure the out-of-bounds current correction only runs when not isUltimo, and bottom is shownBug #4 — Undo não reverte o SRS no Firestore:Bug #4: Persist SRS revert to Firestore on undoBug #4: Persist SRS revert to Firestore on undoBug #5 — XSS em respostaTxt:Bug #5: Escape respostaTxt to prevent XSSBug #5: Escape respostaTxt to prevent XSSMelhoria #1 — Extrair _resolverUid como utilitário e substituir os 3 lugares:Improvement #1: Add _resolverUid utility after _shuffleImprovement #1: Add _resolverUid utility after _shuffleNow replace the inline uid resolutions in _srAtualizar and initCards:Editou 2 arquivosEditou 2 arquivosProblema #8 — _srEstatisticas infla contador de dominados:Bug #8: Fix _srEstatisticas to count only truly dominated cardsBug #8: Fix _srEstatisticas to count only truly dominated cardsstorage.js — Remover logs de debug em produção (Melhoria #3):Editou 2 arquivosEditou 2 arquivosAgora copiar para outputs:Executou um comando, leu um arquivoExecutou um comando, leu um arquivo
🧠 Correções aplicadas:

Bug #1 — Removida a função duplicada _srMontarDeck; _reiniciar agora chama _srMontarDeck_com(_estado.cardsData, _estado.discId), eliminando divergência silenciosa entre as duas implementações.
Bug #2 — _autoInit chamava initCards dentro de DOMContentLoaded, que nunca dispara em módulos ES6 (o parser já concluiu antes do módulo executar). O listener foi removido e initCards é chamado diretamente.
Bug #3 — isUltimo dependia de current >= cards.length, condição sempre verdadeira em relação à segunda parte. Simplificado para isUltimo = todosRespondidos. O if (isUltimo && todosRespondidos) redundante foi colapsado em if (isUltimo).
Bug #4 — _desfazer restaurava _srCache em memória mas não persistia no Firestore. Agora chama salvarPerfilSRS com o perfil anterior, garantindo consistência após reload.
Bug #5 — respostaTxt era injetado via innerHTML sem escape. Corrigido para ${_esc(respostaTxt)}, alinhado ao tratamento dos demais campos.
Problema #8 — _srEstatisticas contava como "dominados" cards com revisão futura mas não dominados. Corrigido para contar apenas p.dominado === true.
Melhoria #1 — Padrão typeof nomeUsuario === 'object' ? nomeUsuario.uid : nomeUsuario extraído para _resolverUid(u) e aplicado nos 3 lugares de uso.
Melhoria #3 — Removidos console.log de debug em storage.js (_docRef e carregarPerfisSRS) que vazavam para produção.