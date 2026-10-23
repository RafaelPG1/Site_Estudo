"""Verificação ESTÁTICA (não abre navegador): confere se todo CSS/JS/imagem/ícone referenciado
pelas páginas HTML dos jogos existe, e se cada área tem o ícone .ico certo."""
import os, re, sys, pathlib
raiz=None
for c in [os.environ.get('NEXUS_SITE'), pathlib.Path(__file__).resolve().parent.parent, pathlib.Path(__file__).resolve().parent/'site_new']:
    if c and (pathlib.Path(c)/'index.html').exists(): raiz=pathlib.Path(c); break
if not raiz: print('ERRO: não achei a raiz do site (pasta com index.html). Rode dentro de "testes" ou defina NEXUS_SITE.'); sys.exit(2)
jogos=next((raiz/n for n in ('games','Games') if (raiz/n).is_dir()),None)
if not jogos: print('ERRO: pasta games/ não encontrada em',raiz); sys.exit(2)
ok=fail=0
def chk(c,msg):
    global ok,fail
    if c: ok+=1
    else: fail+=1; print('  ✘',msg)
paginas=[jogos/'jogo.html']+sorted((jogos/'jogos'/'entretenimento').glob('*/*/*.html'))+sorted((jogos/'jogos'/'estudo').glob('*/*.html'))
vistos=set(); paginas=[p for p in paginas if not (p in vistos or vistos.add(p))]
for pg in paginas:
    s=pg.read_text(encoding='utf8')
    for m in re.finditer(r'(?:href|src)="([^"#]+)"',s):
        u=m.group(1)
        if re.match(r'(https?:|data:|mailto:|//|javascript:)',u): continue
        alvo=(pg.parent/u.split('?')[0]).resolve()
        chk(alvo.exists(),f'{pg.relative_to(raiz)}: referência quebrada → {u}')
    # imports de JS relativos (estáticos)
for js in list((jogos).glob('*.js'))+list((jogos/'template').glob('*.js'))+list((jogos/'jogos'/'estudo').glob('*/*.js')):
    s=js.read_text(encoding='utf8')
    s=re.sub(r'/\*.*?\*/','',s,flags=re.S)                # remove comentários /* … */
    for linha in s.splitlines():
        t=linha.strip()
        if t.startswith(('*','//','/*')): continue          # ignora comentários
        m=re.match(r"""(?:import|export)\b[^'"]*?['"](\.{1,2}/[^'"]+)['"]""",t)
        if m:
            u=m.group(1); alvo=(js.parent/u).resolve(); chk(alvo.exists(),f'{js.relative_to(raiz)}: import quebrado → {u}')
# ícones por área (migração dos favicons)
FAV='shared/img/favicons/'
def tem(p,frag): return frag in p.read_text(encoding='utf8')
chk(tem(jogos/'jogo.html','favicons/games/games.ico'),'hub não referencia games/games.ico')
for g in ['show_milhao','vdd_falso','completar_frase','flashcard','associacao']:
    chk(tem(jogos/'jogos'/'estudo'/g/f'{g}.html','favicons/games/estudos/estudos.ico'),f'{g}: não referencia estudos.ico')
for pg in sorted((jogos/'jogos'/'entretenimento').glob('*/*/*.html')):
    chk(tem(pg,'favicons/games/entretenimentos/entretenimentos.ico'),f'{pg.name}: não referencia entretenimentos.ico')
for nome in ['favicon.ico','resumo/resumo.ico','quiz/quiz.ico','dashboard/dashboard.ico','games/games.ico','games/estudos/estudos.ico','games/entretenimentos/entretenimentos.ico']:
    f=raiz/'shared'/'img'/'favicons'/nome; chk(f.exists(),f'{f} não existe')
    if f.exists():
        b=f.read_bytes(); n=int.from_bytes(b[4:6],'little'); chk(b[:4]==b'\x00\x00\x01\x00' and n>=5,f'{nome} não é um .ico multi-tamanho válido')
for rel,ico in [('index.html','favicon.ico'),('resumo/resumo.html','resumo/resumo.ico'),('quiz/quiz.html','quiz/quiz.ico'),('dashboard/dashboard.html','dashboard/dashboard.ico')]:
    if (raiz/rel).exists(): chk(tem(raiz/rel,'favicons/'+ico) and not tem(raiz/rel,'favicon_io'),f'{rel}: favicon novo ausente ou ainda com favicon_io')
# botão Nexus + Voltar nos 21 jogos
for pg in sorted((jogos/'jogos'/'estudo').glob('*/*.html'))+sorted((jogos/'jogos'/'entretenimento').glob('*/*/*.html')):
    s=pg.read_text(encoding='utf8'); nome=str(pg.relative_to(jogos))
    chk('nx-nav__home' in s and 'nexus-nav.css' in s,f'{nome}: sem botão Nexus/CSS')
    if 'entretenimento' in nome: chk('<span>Voltar</span>' in s and '<span>Jogos</span>' not in s,f'{nome}: texto do Voltar')
# logo.js não pode mais trocar favicons (cada página declara o seu)
lj=raiz/'shared'/'js'/'utils'/'logo.js'
if lj.exists():
    t=lj.read_text(encoding='utf8'); chk('function _injetarFavicons' not in t and '_injetarFavicons();' not in t and 'favicon_io' not in t and 'export function injetarLogo' in t,'logo.js: ainda injeta favicons / referencia favicon_io / perdeu injetarLogo')
print(f'\nRESULTADO ESTÁTICO: {ok} verificações OK, {fail} falhas ({len(paginas)} páginas analisadas)')
sys.exit(1 if fail else 0)
