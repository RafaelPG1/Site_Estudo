import asyncio, re, sys, json, threading, http.server, socketserver, functools, os
from playwright.async_api import async_playwright
ROOT=os.path.dirname(os.path.abspath(__file__))
FAKE=f'{ROOT}/fake'
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
    def end_headers(self):
        self.send_header('Cache-Control','no-store'); super().end_headers()
def serve(site):
    class TS(socketserver.ThreadingTCPServer): allow_reuse_address=True; daemon_threads=True
    srv=TS(('127.0.0.1',0),functools.partial(Q,directory=site)); threading.Thread(target=srv.serve_forever,daemon=True).start()
    return srv, srv.server_address[1]
ANA={'uid':'ana','nome':'Ana','avatar':'A','foto':None,'admin':False}
def init_script(cache=None, auth=None, delay=0, fs=None, offline=False):
    js=["try{if(!sessionStorage.__seeded){"]
    if cache is not None: js.append(f"localStorage.setItem('nexus_usuario',{json.dumps(json.dumps(cache))});")
    if auth is not None: js.append(f"localStorage.setItem('__fakeauth',{json.dumps(json.dumps({'user':auth,'delay':delay}))});")
    if fs is not None: js.append(f"localStorage.setItem('__fakefs',{json.dumps(json.dumps(fs))});")
    if offline: js.append("localStorage.setItem('__fsoffline','1');")
    js.append("sessionStorage.__seeded='1';}}catch(e){}")
    return ''.join(js)
async def novo(p, site_port, init=None):
    b=await p.chromium.launch(); ctx=await b.new_context(viewport={'width':1280,'height':800})
    if init: await ctx.add_init_script(init)
    async def sdk(route):
        n=re.search(r'/10\.12\.0/(.+)$',route.request.url).group(1)
        await route.fulfill(status=200,content_type='text/javascript',headers={'access-control-allow-origin':'*'},body=open(f'{FAKE}/{n}',encoding='utf8').read())
    await ctx.route('https://www.gstatic.com/firebasejs/10.12.0/*',sdk)
    async def other(route):
        u=route.request.url
        if 'fonts.g' in u: return await route.fulfill(status=200,content_type='text/css',body='')
        await route.fulfill(status=200,content_type='text/css' if u.endswith('.css') else 'text/plain',body='')
    await ctx.route(re.compile(r'https://(?!www\.gstatic\.com/firebasejs).*'),other)
    return b,ctx
async def pagina(ctx, port, path):
    pg=await ctx.new_page(); errs=[]; cons=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.on('console',lambda m:cons.append((m.type,m.text)))
    await pg.goto(f'http://127.0.0.1:{port}/{path}')
    return pg,errs,cons
async def fslog(pg): return await pg.evaluate('globalThis.__fslog||[]')

# ───────────────────────── localizar e preparar o site para os testes ─────────────────────────
import shutil, tempfile, pathlib
_IGNORAR = shutil.ignore_patterns('.git','node_modules','.venv','venv','testes','__pycache__','*.zip','*.rar','.vscode')
def achar_site():
    """Procura a raiz do site: variável NEXUS_SITE, depois a pasta-pai de testes/, depois ./site_new."""
    cands=[]
    if os.environ.get('NEXUS_SITE'): cands.append(pathlib.Path(os.environ['NEXUS_SITE']))
    cands += [pathlib.Path(ROOT).parent, pathlib.Path(ROOT)/'site_new']
    for c in cands:
        if c.is_dir() and (c/'index.html').exists() and ((c/'games').is_dir() or (c/'Games').is_dir()):
            return c
    return None
def preparar_site():
    """Copia o site para uma pasta TEMPORÁRIA (o seu projeto não é alterado), cria nela os dados
    de AP2 só para o teste e confere se tudo que o teste precisa existe. Sai com mensagem clara se faltar algo."""
    origem=achar_site()
    if not origem:
        print('\nERRO DE PREPARAÇÃO: não encontrei o site.\n'
              ' • Rode o teste de dentro da pasta "testes" que fica DENTRO da pasta do projeto (onde está o index.html), ou\n'
              ' • defina a variável NEXUS_SITE com o caminho da pasta do projeto (ex.: set NEXUS_SITE=C:\\caminho\\Site_Questões).')
        sys.exit(2)
    tmp=pathlib.Path(tempfile.mkdtemp(prefix='nexus_site_'))/'site'
    shutil.copytree(origem,tmp,ignore=_IGNORAR)
    if not (tmp/'games').is_dir() and (tmp/'Games').is_dir(): (tmp/'Games').rename(tmp/'games')
    faltam=[]
    for p in ['games/jogo.html','games/template/conteudo-loader.js','shared/css/audio/audio-btns.css','src/session-tracker.js',
              'content/games/show_milhao/2026.2/AP1/show_milhao_data.js','content/games/vdd_falso/2026.2/AP1/vdd_falso_data.js',
              'content/games/completar_frase/2026.2/AP1/completar_frase_data.js','content/games/flashcards/2026.2/AP1/cards_data.js',
              'content/games/associacao/2026.2/AP1/associacao_data.js']:
        if not (tmp/p).exists(): faltam.append(p)
    if faltam:
        print('\nERRO DE PREPARAÇÃO: faltam arquivos no projeto (copie as pastas do pacote para dentro dele):')
        for f in faltam: print('   -',f)
        print(f'(site analisado: {origem})'); sys.exit(2)
    # fixtures de AP2: existem SÓ nesta cópia temporária, para provar que AP2 é lida de outra pasta
    for pasta in ['show_milhao','vdd_falso','completar_frase','flashcards','associacao']:
        ap1=next((tmp/'content/games'/pasta/'2026.2'/'AP1').glob('*.js')); d=tmp/'content/games'/pasta/'2026.2'/'AP2'; d.mkdir(parents=True,exist_ok=True)
        (d/ap1.name).write_text(ap1.read_text(encoding='utf8').replace('[TESTE]','[FIXTURE-AP2]'),encoding='utf8')
    print(f'Site de teste preparado (cópia temporária de {origem})')
    return str(tmp)
