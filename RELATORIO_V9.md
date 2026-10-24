# v9 — som nos botões Voltar/Nexus e botão de efeito sonoro nos 21 jogos (nada foi publicado)

## O que mudou
- **Som no Voltar e no Nexus (21 jogos):** passar o mouse toca `hover`; clicar toca `click` (mesmos sons do logo do hub, área "game"). Em links comuns o clique espera 140 ms para o som terminar antes de trocar de página (Ctrl/Shift/botão do meio continuam normais). Causa: esses botões nunca tiveram código de som.
- **Botão de efeito sonoro:** os jogos de estudo já tinham; os 16 de **entretenimento** passam a ter (o mesmo botão do resto do site). O botão da IA **não** foi colocado. Nos de entretenimento ele fica no canto inferior direito. Respeita a opção do botão de som nas Configurações.
- **Como:** módulo novo `games/template/nx-som.js` (carrega o CSS e inicia botão e sons). Cada página ganha **uma linha** (`<script type="module" src=".../nx-som.js">` antes de `</body>`), colocada por `ferramentas/jogos_som.py`.
- **O que o botão controla:** os sons **compartilhados** do Nexus (como os dos botões Voltar/Nexus). Os efeitos do próprio jogo de entretenimento continuam sob o botão de som do **topo do jogo**, pois cada jogo tem áudio próprio. Ligar os dois é possível, mas mexe nos 16 jogos; diga se quiser.
- Inclui os ajustes anteriores (v8.x): selo igual ao `games.ico`, ícones dos 5 jogos de estudo, botão Nexus igual ao do hub.

## Como aplicar (passo a passo)
1. `git switch -c feat/jogos-favicons-som`
2. Copie para o projeto, substituindo: `games/template/` (3 arquivos), `ferramentas/` e `testes/`.
3. Terminal na pasta do `index.html`. Requisitos: `pip install pillow playwright` e `playwright install chromium`.
4. Rode, nesta ordem:
   - `python ferramentas/favicons_jogos.py` → esperado `21 de 21 jogos prontos.`
   - `python ferramentas/jogos_som.py` → esperado `N página(s) alterada(s); 21 analisadas.` (na 2ª vez, tudo "já estava certo")
   - `python ferramentas/favicons_migrar.py verificar` → `0 falha(s); 0 referência(s)`
5. Opcional, em `testes/`: `python t_estatico.py` (esperado 527 OK) e `python t_v4.py` (esperado 400/400 OK, ~15 min).
6. Abra o site (Ctrl+F5) e teste o som ao passar o mouse e clicar em Voltar e Nexus, e o botão de som nos jogos de entretenimento. O navegador só toca som depois de um clique na página.
Erros comuns: terminal fora da raiz; falta de pillow/playwright; `Acesso negado` (OneDrive) ao apagar o svg antigo (apague à mão); sem som → clique na página antes e confira se o botão de som não está mudo.

## Verificado (simulado, projeto equivalente ao seu)
Estáticos 527 OK, 0 falhas. `t_v4.py` 400/400 OK (Firebase simulado): botão de som presente (um só) nos 21 jogos, IA ausente nos de entretenimento, botão dentro da tela, Voltar/Nexus disparando hover e clique. Captura de tela em desktop e celular: o botão de som não cobre o "?" do jogo.
**Não verificado:** o som saindo no alto-falante (o teste confirma que o código dispara o som, não o áudio em si), as abas no navegador e o seu projeto real. Confira o diff antes de commitar.
