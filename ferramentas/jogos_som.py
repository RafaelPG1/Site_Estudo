"""Liga o som e o botão de efeito sonoro nos 21 jogos (nada é publicado; só mexe em arquivos locais).

Coloca, antes de </body> de cada página de jogo, UMA linha:
  <script type="module" src="…/games/template/nx-som.js"></script>
O arquivo games/template/nx-som.js precisa estar no projeto. Pode rodar de novo à vontade (não duplica).

Uso (na RAIZ do projeto, onde está o index.html):   python ferramentas/jogos_som.py
"""
import os, re, sys, pathlib
RAIZ = pathlib.Path('.').resolve()
if not (RAIZ/'index.html').exists(): sys.exit('ERRO: rode na raiz do projeto (onde está o index.html).')
GAMES = next((n for n in ('games', 'Games') if (RAIZ/n).is_dir()), None)
if not GAMES: sys.exit('ERRO: pasta games não encontrada.')
MOD = RAIZ/GAMES/'template'/'nx-som.js'
if not MOD.exists(): sys.exit(f'ERRO: falta {GAMES}/template/nx-som.js — copie o arquivo do pacote primeiro.')
paginas = sorted((RAIZ/GAMES/'jogos'/'estudo').glob('*/*.html')) + sorted((RAIZ/GAMES/'jogos'/'entretenimento').glob('*/*/*.html'))
alt = 0
for p in paginas:
    s = p.read_text(encoding='utf8')
    if 'nx-som.js' in s: print('  =', p.relative_to(RAIZ).as_posix(), '(já estava certo)'); continue
    rel = os.path.relpath(MOD, p.parent).replace('\\', '/')
    linha = f'<script type="module" src="{rel}"></script>\n'
    m = list(re.finditer(r'[ \t]*</body>', s, re.I))
    if not m: print('  ✘ sem </body>:', p.relative_to(RAIZ).as_posix()); continue
    i = m[-1].start(); s = s[:i] + '  ' + linha + s[i:]
    p.write_text(s, encoding='utf8'); alt += 1; print('  ✔', p.relative_to(RAIZ).as_posix())
print(f'\n{alt} página(s) alterada(s); {len(paginas)} analisadas.')
