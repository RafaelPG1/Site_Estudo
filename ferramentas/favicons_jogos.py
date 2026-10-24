"""Favicon próprio de cada jogo — estudo E entretenimento (nada é publicado; só mexe em arquivos locais).

O que faz, para cada  games/jogos/entretenimento/<tipo>/<jogo>/  e  games/jogos/estudo/<jogo>/ :
  1. pega o favicon.svg do jogo e o coloca DENTRO do círculo do selo do ícone "entretenimentos"
     (o círculo vermelho deixa de existir; fica só a borda preta separando do logo);
  2. gera o .ico multi-tamanho de verdade em
       shared/img/favicons/games/entretenimentos/<tipo>/<jogo>/<jogo>.ico   (entretenimento)
       shared/img/favicons/games/estudos/<jogo>/<jogo>.ico                  (estudo);
  3. MOVE o favicon.svg para a mesma pasta nova. Os jogos de estudo não tinham favicon.svg: o script cria um
     (desenho próprio, na cor do jogo no hub) e guarda na pasta nova — você pode trocar por outro e rodar de novo;
  4. troca, no <jogo>.html, o link do favicon para o novo .ico e remove o link antigo do favicon.svg.
Pode rodar de novo à vontade (idempotente). Se algo falhar em um jogo, os outros continuam.

Uso (na RAIZ do projeto, onde está o index.html):
  python ferramentas/favicons_jogos.py
Requer:  pip install pillow playwright   e   playwright install chromium   (o Playwright você já usa nos testes)
"""
import re, sys, shutil, pathlib, base64
import xml.etree.ElementTree as ET
RAIZ = pathlib.Path('.').resolve()
if not (RAIZ/'index.html').exists(): sys.exit('ERRO: rode na raiz do projeto (onde está o index.html).')
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
try:
    from PIL import Image, ImageDraw, ImageChops
    from gerar_favicons import BASE, tile, escrever_ico
except ImportError: sys.exit('ERRO: falta o Pillow. Rode:  pip install pillow')
try: from playwright.sync_api import sync_playwright
except ImportError: sys.exit('ERRO: falta o Playwright. Rode:  pip install playwright   e depois   playwright install chromium')

GAMES = next((n for n in ('games', 'Games') if (RAIZ/n).is_dir()), None)
if not GAMES: sys.exit('ERRO: pasta games não encontrada.')
FAV = RAIZ/'shared'/'img'/'favicons'/'games'
ANEL = (7, 9, 16, 255)          # a borda preta que separa o selo do logo

# Favicons dos jogos de ESTUDO (não tinham favicon.svg). 32×32, mesmo estilo dos de entretenimento: fundo escuro + desenho na cor do jogo no hub.
SVG_ESTUDO = {
 'flashcard': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="#0d2a1d"/><rect x="9" y="5" width="16" height="20" rx="3" fill="#2f7a55" transform="rotate(10 17 15)"/><rect x="6" y="7" width="17" height="20" rx="3" fill="#4ade96"/><rect x="9.5" y="12" width="10" height="2.2" rx="1.1" fill="#0d2a1d"/><rect x="9.5" y="17" width="7" height="2.2" rx="1.1" fill="#0d2a1d"/></svg>',
 'vdd_falso': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="#211a45"/><path d="M5.5 10.5l3.6 3.8 6.4-7.6" fill="none" stroke="#b39dfa" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.5 18.5l7 7M25.5 18.5l-7 7" fill="none" stroke="#e9e3ff" stroke-width="3" stroke-linecap="round"/><path d="M5 27h8M19 5h8" stroke="#6f5cc0" stroke-width="2" stroke-linecap="round"/></svg>',
 'completar_frase': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="#0f2240"/><rect x="5" y="7" width="22" height="3" rx="1.5" fill="#8fb8f5"/><rect x="5" y="14.5" width="7" height="3" rx="1.5" fill="#8fb8f5"/><rect x="14" y="12.5" width="9" height="7" rx="2" fill="#6aa8ff"/><rect x="25" y="14.5" width="2.5" height="3" rx="1.2" fill="#8fb8f5"/><rect x="5" y="22" width="15" height="3" rx="1.5" fill="#8fb8f5"/></svg>',
 'show_milhao': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="#34200a"/><path d="M9 6h14l5 10-5 10H9L4 16z" fill="#ffb04d" stroke="#ffd9a3" stroke-width="1.5" stroke-linejoin="round"/><path d="M16 10.5l4 5.5-4 5.5-4-5.5z" fill="#34200a"/></svg>',
 'associacao': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="#3a1226"/><path d="M9 9L23 23M9 16h14M9 23L23 9" stroke="#ff7ab8" stroke-width="2" stroke-linecap="round" opacity=".85"/><circle cx="8" cy="9" r="3.2" fill="#ffd0e6"/><circle cx="8" cy="16" r="3.2" fill="#ffd0e6"/><circle cx="8" cy="23" r="3.2" fill="#ffd0e6"/><circle cx="24" cy="9" r="3.2" fill="#ff7ab8"/><circle cx="24" cy="16" r="3.2" fill="#ff7ab8"/><circle cx="24" cy="23" r="3.2" fill="#ff7ab8"/></svg>',
}
# Tamanho do selo (círculo com o jogo), em coordenadas do ícone de 512 px: (centro x, centro y, raio, anel).
# IGUAL ao selo de games/games.ico (ferramentas/gerar_favicons.py: icone()), para os ícones dos jogos ficarem do mesmo tamanho.
SELO_ABA     = (338, 338, 172, 12)     # tamanhos 16, 24 e 32 px (aba do navegador): selo GRANDE, para o jogo aparecer
SELO_MAIOR   = (372, 372, 122, 12)     # tamanhos 48 px ou mais: selo menor, o logo Nexus aparece mais

def reparar_svg(texto, html):
    """Conserta SVG que não funciona sozinho: (1) <use href="#x"> cujo <symbol id="x"> está só no HTML do jogo → copia o symbol
    para dentro do svg; (2) tag não fechada (ex.: falta </g>) → fecha. Devolve (texto, o que foi consertado)."""
    avisos = []
    ids = [i for i in re.findall(r'href="#([\w-]+)"', texto) if f'id="{i}"' not in texto]
    if ids and html.exists():
        h = html.read_text(encoding='utf8')
        defs = ''.join(m.group(0) for i in dict.fromkeys(ids) for m in re.finditer(rf'<symbol\b[^>]*\bid="{i}"[^>]*>.*?</symbol>', h, re.S))
        if defs: texto = re.sub(r'(<svg\b[^>]*>)', lambda m: m.group(1)+'<defs>'+defs+'</defs>', texto, count=1); avisos.append('copiei os <symbol> usados do HTML para dentro do svg')
    for _ in range(5):
        try: ET.fromstring(texto); break
        except ET.ParseError:
            fim = texto.rstrip(); pilha = []
            for t in re.finditer(r'<(/?)(\w+)\b[^>]*?(/?)>', fim):
                if t.group(3): continue
                if t.group(1):
                    while pilha and pilha[-1] != t.group(2): pilha.pop()
                    if pilha: pilha.pop()
                else: pilha.append(t.group(2))
            if not pilha: break
            texto = fim + ''.join(f'</{n}>' for n in reversed(pilha)) + '\n'; avisos.append('fechei tags não fechadas')
    return texto, avisos

def rasterizar(pg, svg_bytes, tam=512):
    uri = 'data:image/svg+xml;base64,' + base64.b64encode(svg_bytes).decode()
    pg.set_content(f'<body style="margin:0;background:transparent"><img id=i src="{uri}" width={tam} height={tam} style="display:block">')
    pg.wait_for_function('document.getElementById("i").complete && document.getElementById("i").naturalWidth>0', timeout=8000)
    import io; return Image.open(io.BytesIO(pg.locator('#i').screenshot(omit_background=True))).convert('RGBA')

def circulo(base, svg_img, selo):
    x, y, R, anel = selo
    """cola svg_img recortada em círculo (raio R) em (x,y) com anel preto de 'anel' px (suavizado)."""
    im = base.copy(); k = 4
    for raio, cor_img in ((R+anel, None), (R, svg_img)):
        m = Image.new('L', (512*k, 512*k), 0); ImageDraw.Draw(m).ellipse(((x-raio)*k, (y-raio)*k, (x+raio)*k, (y+raio)*k), fill=255)
        m = m.resize((512, 512), Image.LANCZOS)
        if cor_img is None: im.paste(Image.new('RGBA', (512, 512), ANEL), (0, 0), m)
        else:
            camada = Image.new('RGBA', (512, 512), (0, 0, 0, 0)); lado = 2*raio
            camada.paste(cor_img.resize((lado, lado), Image.LANCZOS), (x-raio, y-raio))
            im.paste(camada, (0, 0), m)
    im.putalpha(ImageChops.multiply(im.getchannel('A'), base.getchannel('A')))      # nada passa do canto arredondado do ícone
    return im

GRUPOS = [   # (pasta dentro de games/jogos, padrão dos html, pasta de destino em favicons/games, tem "tipo"?)
    ('entretenimento', '*/*/*.html', 'entretenimentos', True),
    ('estudo',         '*/*.html',   'estudos',         False),
]

def processar(pg, pasta, destino, tipo):
    jogo = pasta.name
    rotulo = f'{tipo}/{jogo}' if tipo else jogo
    novo = FAV/destino/tipo/jogo if tipo else FAV/destino/jogo
    svg_velho, svg_novo = pasta/'favicon.svg', novo/'favicon.svg'
    fonte = svg_velho if svg_velho.exists() else svg_novo
    if fonte.exists(): texto = fonte.read_text(encoding='utf8')
    elif jogo in SVG_ESTUDO and destino == 'estudos': texto = SVG_ESTUDO[jogo]; print(f'    ℹ {rotulo}: não tinha favicon.svg — criei um desenho novo')
    else: print(f'  ✘ {rotulo}: favicon.svg não encontrado'); return False
    texto, avisos = reparar_svg(texto, pasta/f'{jogo}.html')
    if avisos: print(f'    ℹ {rotulo}: favicon.svg tinha defeito ({"; ".join(avisos)}) — guardei a versão consertada')
    img = rasterizar(pg, texto.encode('utf8'))
    base = tile(BASE)
    escrever_ico(novo/f'{jogo}.ico', circulo(base, img, SELO_ABA), circulo(base, img, SELO_MAIOR))
    svg_novo.parent.mkdir(parents=True, exist_ok=True)
    if fonte != svg_novo or not svg_novo.exists() or avisos: svg_novo.write_text(texto, encoding='utf8')
    if svg_velho.exists():                                   # MOVER (o svg já foi gravado na pasta nova)
        try: svg_velho.unlink()
        except OSError as e: print(f'    ⚠ copiei, mas não consegui apagar {svg_velho} ({e.__class__.__name__}); apague à mão.')
    html = pasta/f'{jogo}.html'
    if not html.exists(): print(f'  ✘ {rotulo}: {jogo}.html não existe'); return False
    s = html.read_text(encoding='utf8'); o = s
    prefixo = '../'*(len(html.relative_to(RAIZ).parts)-1)
    caminho = f'games/{destino}/{tipo}/{jogo}/{jogo}.ico' if tipo else f'games/{destino}/{jogo}/{jogo}.ico'
    novo_link = f'<link rel="icon" type="image/x-icon" href="{prefixo}shared/img/favicons/{caminho}" sizes="16x16 24x24 32x32 48x48 64x64 128x128 256x256" />'
    s = re.sub(r'[ \t]*<link\b[^>]*\bhref="favicon\.svg"[^>]*>[ \t]*\n?', '', s)                 # some o link do svg
    s = re.sub(r'<link\b[^>]*\brel="icon"[^>]*favicons/games/(?:entretenimentos|estudos)/[^>]*>', lambda m: novo_link, s, count=1)
    if novo_link not in s: print(f'  ✘ {rotulo}: não achei onde trocar o link do favicon no HTML'); return False
    if s != o: html.write_text(s, encoding='utf8')
    print(f'  ✔ {rotulo}  →  shared/img/favicons/{caminho}'); return True

def main():
    tarefas = []
    for area, padrao, destino, tem_tipo in GRUPOS:
        for pasta in sorted({p.parent for p in (RAIZ/GAMES/'jogos'/area).glob(padrao)}):
            tarefas.append((pasta, destino, pasta.parent.name if tem_tipo else None))
    ok = 0
    with sync_playwright() as pw:
        nav = pw.chromium.launch(); pg = nav.new_page(viewport={'width': 512, 'height': 512})
        for pasta, destino, tipo in tarefas:
            try: ok += bool(processar(pg, pasta, destino, tipo))
            except Exception as e: print(f'  ✘ {pasta.name}: {e.__class__.__name__}: {e}')
        nav.close()
    print(f'\n{ok} de {len(tarefas)} jogos prontos.')
    if ok != len(tarefas): sys.exit(1)

if __name__ == '__main__': main()
