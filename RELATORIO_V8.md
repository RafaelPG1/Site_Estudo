# v8.1 — círculo maior, ícones dos jogos de estudo e botão Nexus igual ao do hub (nada foi publicado)

## 1. Círculo pequeno demais
**Causa real (era o código, não as imagens):** os `.ico` têm duas versões do selo. A aba do navegador usa os tamanhos 16–32 px, que usavam o selo **menor** (raio 122 de 512), pensado para o logo aparecer. Por isso, na aba, o jogo ficava minúsculo, embora o arquivo de 256 px parecesse bom. Agora:
- tamanhos 16/24/32 px: selo **bem maior** (raio 196);
- 48 px ou mais: selo também maior (raio 186, antes 172);
- o selo é cortado pelo canto arredondado do ícone (nada passa da borda).
Ajuste no topo do `ferramentas/favicons_jogos.py` (`SELO_GRANDE`, `SELO_PEQUENO`): aumente o 3º número para um selo maior, e rode o script de novo.

## 2. Jogos de estudo também têm ícone próprio
Os 5 jogos de estudo não tinham `favicon.svg`, então o script **cria** um desenho para cada, na cor do jogo no hub: Flashcard (verde, cartas), Verdadeiro ou Falso (roxo, ✓ e ✕), Complete a Frase (azul, linhas com lacuna), Show do Milhão (âmbar, hexágono), Associação (rosa, pontos ligados). Ficam em `shared/img/favicons/games/estudos/<jogo>/<jogo>.ico` (+ `favicon.svg` na mesma pasta). **Para usar outro desenho,** substitua o `favicon.svg` daquela pasta e rode o script de novo. Os 16 de entretenimento seguem como antes. Veja `previa_icones_21_jogos.png` (256, 32 e 16 px).

## 3. Botão Nexus dentro dos jogos = botão Nexus do hub
Antes, o botão dentro do jogo era um quadradinho com fundo e borda. Agora ele tem o **mesmo desenho do ícone Nexus da área de Games** (`logo.css`): cantos 22%, borda fina, brilho verde permanente e, no hover, brilho maior com leve aumento. Ele tem 34 px, a mesma altura do botão Voltar (no hub o ícone tem 32 px por causa do zoom de 80%). Só o CSS mudou (`games/template/nexus-nav.css`), nos 21 jogos de uma vez; o HTML não mudou. O link continua levando ao `index.html` da raiz. Não mostrei o texto "Nexus Study" ao lado (só o ícone, para caber no topo); se quiser, dá para colocar.

## Como aplicar (passo a passo)
1. Copie para o projeto, substituindo: `games/template/nexus-nav.css`, `ferramentas/` e `testes/`.
2. Terminal na pasta do `index.html`. Requisitos (os mesmos dos testes): `pip install pillow playwright` e `playwright install chromium`.
3. `python ferramentas/favicons_jogos.py`. Esperado: `21 de 21 jogos prontos.` (avisos `ℹ` sobre o solitário e os 5 de estudo são normais; pode repetir quando quiser).
4. `python ferramentas/favicons_migrar.py verificar`. Esperado: `0 falha(s); 0 referência(s)`.
5. Opcional, em `testes/`: `python t_estatico.py` (esperado 462 OK) e `python t_v4.py` (esperado 326/326 OK, ~10 min).
6. Ctrl+F5 no navegador (cache de favicon). Os ícones podem demorar a mudar na aba; teste em aba anônima.
Erros comuns: terminal fora da raiz; falta de pillow/playwright (o script diz o comando); `Acesso negado` ao apagar o svg antigo (OneDrive): apague à mão.

## Verificado (simulado, projeto equivalente ao seu)
- `favicons_jogos.py`: 21/21, 2ª execução também 21/21; `verificar` 0 falhas.
- Estáticos: **462 OK, 0 falhas**. `t_v4.py`: **326/326 OK** (Firebase simulado), incluindo a nova seção que compara o botão Nexus de cada um dos 21 jogos com o ícone do hub (brilho, cantos, cor da borda, hover, 34 px) e o ícone próprio de cada jogo na aba.
- Num teste visual, o brilho do botão não é cortado pelo topo.
**Não verificado:** a aparência real nas abas do seu navegador e o seu projeto de verdade (o script altera os `.html` dos 21 jogos; confira o diff antes de commitar).
