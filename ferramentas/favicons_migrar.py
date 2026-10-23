"""Migração dos favicons do Nexus Study (nada é publicado; só mexe em arquivos locais).

Comandos (rode na RAIZ do projeto, a pasta onde está o index.html):
  python ferramentas/favicons_migrar.py aplicar    → coloca o <link rel="icon"> certo em cada página (idempotente)
  python ferramentas/favicons_migrar.py verificar  → confere se os arquivos existem e se ainda há referência a "favicon_io"
  python ferramentas/favicons_migrar.py apagar     → apaga shared/img/favicon_io SOMENTE se não restar nenhuma referência
"""
import re, sys, shutil, pathlib
RAIZ = pathlib.Path('.').resolve()
if not (RAIZ/'index.html').exists():
    sys.exit('ERRO: rode na raiz do projeto (onde está o index.html).')
GAMES = next((n for n in ('games', 'Games') if (RAIZ/n).is_dir()), None)
FAV = 'shared/img/favicons'
SIZES = '16x16 24x24 32x32 48x48 64x64 128x128 256x256'

def alvos():
    """(página, arquivo .ico, tipo)  — tipo 'raiz' coloca também PNG/apple/manifest."""
    t = [('index.html', 'favicon.ico', 'raiz'),
         ('resumo/resumo.html', 'resumo/resumo.ico', 'ico'),
         ('quiz/quiz.html', 'quiz/quiz.ico', 'ico'),
         ('quiz/disciplinas/disciplina.html', 'quiz/quiz.ico', 'ico'),
         ('quiz/template/template.html', 'quiz/quiz.ico', 'ico'),
         ('dashboard/dashboard.html', 'dashboard/dashboard.ico', 'ico'),
         # páginas que antes recebiam o favicon do logo.js (injeção automática removida na v2.3) → ícone geral do Nexus
         ('admin/admin.html', 'favicon.ico', 'raiz'),
         ('atlas/atlas.html', 'favicon.ico', 'raiz'),
         ('pessoal/pessoal.html', 'favicon.ico', 'raiz'),
         ('pessoal/anotacoes/anotacoes.html', 'favicon.ico', 'raiz'),
         ('pessoal/calendar/calendar.html', 'favicon.ico', 'raiz')]
    if GAMES:
        t.append((f'{GAMES}/jogo.html', 'games/games.ico', 'ico'))
        for p in sorted((RAIZ/GAMES/'jogos'/'estudo').glob('*/*.html')):
            t.append((str(p.relative_to(RAIZ)).replace('\\', '/'), 'games/estudos/estudos.ico', 'ico'))
        for p in sorted((RAIZ/GAMES/'jogos'/'entretenimento').glob('*/*/*.html')):
            t.append((str(p.relative_to(RAIZ)).replace('\\', '/'), 'games/entretenimentos/entretenimentos.ico', 'ico'))
    return t

LINK_ICONE = re.compile(r'[ \t]*<link\b[^>]*\brel="(?:shortcut )?icon"[^>]*favicon(?:_io|s)/[^>]*>[ \t]*\n?', re.I)
LINK_OUTROS = re.compile(r'[ \t]*<link\b[^>]*\brel="(?:apple-touch-icon|manifest)"[^>]*favicon(?:_io|s)/[^>]*>[ \t]*\n?', re.I)
LINK_PNG = re.compile(r'[ \t]*<link\b[^>]*\brel="icon"[^>]*type="image/png"[^>]*favicon(?:_io|s)/[^>]*>[ \t]*\n?', re.I)

def aplicar():
    ok = 0
    for rel, ico, tipo in alvos():
        p = RAIZ/rel
        if not p.exists(): print('  (pulado, não existe)', rel); continue
        s = p.read_text(encoding='utf8'); original = s
        prefixo = '../'*(len(pathlib.PurePosixPath(rel).parts)-1)
        base = f'{prefixo}{FAV}'
        for rx in (LINK_ICONE, LINK_PNG, LINK_OUTROS): s = rx.sub('', s)
        if tipo == 'raiz':
            bloco = (f'  <link rel="icon" href="{base}/favicon.ico" sizes="any" />\n'
                     f'  <link rel="icon" type="image/png" sizes="32x32" href="{base}/favicon-32x32.png" />\n'
                     f'  <link rel="icon" type="image/png" sizes="16x16" href="{base}/favicon-16x16.png" />\n'
                     f'  <link rel="apple-touch-icon" sizes="180x180" href="{base}/apple-touch-icon.png" />\n'
                     f'  <link rel="manifest" href="{base}/site.webmanifest" />\n')
        else:
            bloco = f'  <link rel="icon" type="image/x-icon" href="{base}/{ico}" sizes="{SIZES}" />\n'
        # entretenimento: o favicon.svg próprio de cada jogo continua; o .ico da área vem ANTES (reserva p/ navegadores sem SVG)
        m = re.search(r'<title>.*?</title>[ \t]*\n', s, re.S) or re.search(r'<meta charset[^>]*>[ \t]*\n', s, re.I)
        if not m: print('  ✘ sem <title>/<meta charset>:', rel); continue
        s = s[:m.end()] + bloco + s[m.end():]
        if s != original: p.write_text(s, encoding='utf8'); ok += 1; print('  ✔', rel, '→', ico)
        else: print('  =', rel, '(já estava certo)')
    print(f'\n{ok} página(s) alterada(s).')

TEXTOS = ('.html', '.js', '.css', '.json', '.webmanifest', '.md', '.txt', '.py', '.xml', '.yml', '.yaml')
IGNORAR = {'.git', 'node_modules', '.venv', 'venv', '__pycache__', 'testes', 'ferramentas'}
def procurar(termo):
    ach = []
    for p in RAIZ.rglob('*'):
        if not p.is_file() or p.suffix.lower() not in TEXTOS: continue
        partes = set(p.relative_to(RAIZ).parts)
        if partes & IGNORAR or 'favicon_io' in partes: continue
        try: txt = p.read_text(encoding='utf8', errors='ignore')
        except Exception: continue
        for i, l in enumerate(txt.splitlines(), 1):
            if termo in l: ach.append((str(p.relative_to(RAIZ)).replace('\\', '/'), i, l.strip()[:140]))
    return ach

def verificar():
    falhas = 0
    for f in ['favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png', 'site.webmanifest', 'resumo/resumo.ico', 'quiz/quiz.ico',
              'dashboard/dashboard.ico', 'games/games.ico', 'games/estudos/estudos.ico', 'games/entretenimentos/entretenimentos.ico']:
        existe = (RAIZ/FAV/f).exists()
        if not existe: falhas += 1; print('  ✘ falta', f'{FAV}/{f}')
        elif f.endswith('.ico') and (RAIZ/FAV/f).read_bytes()[:4] != b'\x00\x00\x01\x00': falhas += 1; print('  ✘ não é .ico válido:', f)
    for rel, ico, tipo in alvos():
        p = RAIZ/rel
        if not p.exists(): continue
        prefixo = '../'*(len(pathlib.PurePosixPath(rel).parts)-1); esperado = f'{prefixo}{FAV}/{ico}'
        if esperado not in p.read_text(encoding='utf8'): falhas += 1; print('  ✘ referência ausente/errada em', rel, '(esperado', esperado + ')')
        elif not (p.parent/esperado).resolve().exists(): falhas += 1; print('  ✘ caminho não resolve em', rel)
    # informativo: páginas .html sem nenhum <link rel="icon"> (não é falha; o navegador usa o padrão dele)
    sem = []
    for p in sorted(RAIZ.rglob('*.html')):
        rel = str(p.relative_to(RAIZ)).replace('\\', '/')
        if set(p.relative_to(RAIZ).parts) & (IGNORAR | {'content', 'novas_implementações'}): continue
        if 'rel="icon"' not in p.read_text(encoding='utf8', errors='ignore'): sem.append(rel)
    if sem: print('  ℹ páginas sem favicon declarado (informativo):', ', '.join(sem))
    ref = procurar('favicon_io')
    for a, n, l in ref: print(f'  ⚠ ainda referencia favicon_io: {a}:{n}  {l}')
    print(f'\nverificação: {falhas} falha(s); {len(ref)} referência(s) restante(s) a favicon_io.')
    return falhas, ref

def apagar():
    falhas, ref = verificar()
    pasta = RAIZ/'shared'/'img'/'favicon_io'
    if falhas or ref: sys.exit('NÃO apaguei favicon_io: ainda há pendências acima.')
    if not pasta.exists(): sys.exit('favicon_io já não existe.')
    shutil.rmtree(pasta); print('✔ shared/img/favicon_io apagada.')

if __name__ == '__main__':
    {'aplicar': aplicar, 'verificar': verificar, 'apagar': apagar}.get(sys.argv[1] if len(sys.argv) > 1 else '', lambda: sys.exit(__doc__))()
