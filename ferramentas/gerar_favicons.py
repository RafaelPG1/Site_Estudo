"""Gera os favicons do Nexus Study a partir da marca oficial (shared/img/logo.png).
Uso (na raiz do projeto):  python ferramentas/gerar_favicons.py
Saída: shared/img/favicons/…  (.ico multi-tamanho reais + PNGs do favicon geral + site.webmanifest)
Requer: pip install pillow"""
import io, json, struct, sys, pathlib
from PIL import Image, ImageDraw
RAIZ = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else pathlib.Path('.')
SRC = Image.open(RAIZ/'shared/img/logo.png').convert('RGB')
OUT = RAIZ/'shared/img/favicons'
cx, cy, half = 628, 612, 430
BASE = SRC.crop((cx-half, cy-half, cx+half, cy+half)).resize((512, 512), Image.LANCZOS)
INK = (8, 10, 18, 255)

def tile(img, raio=112):
    m = Image.new('L', (512, 512), 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, 511, 511), radius=raio, fill=255)
    o = Image.new('RGBA', (512, 512), (0, 0, 0, 0)); o.paste(img, (0, 0), m); return o

def glifo(d, kind, x, y, k, cor):
    S = lambda v: int(v*k)
    if kind == 'games':        # controle
        d.rounded_rectangle((x-S(78), y-S(42), x+S(78), y+S(44)), radius=S(40), fill=INK)
        d.rectangle((x-S(54), y-S(8), x-S(22), y+S(4)), fill=cor); d.rectangle((x-S(44), y-S(18), x-S(32), y+S(14)), fill=cor)
        d.ellipse((x+S(22), y-S(16), x+S(40), y+S(2)), fill=cor); d.ellipse((x+S(42), y+S(2), x+S(60), y+S(20)), fill=cor)
    elif kind == 'estudos':    # livro aberto
        d.polygon([(x-S(82), y-S(48)), (x-S(6), y-S(34)), (x-S(6), y+S(52)), (x-S(82), y+S(38))], fill=INK)
        d.polygon([(x+S(82), y-S(48)), (x+S(6), y-S(34)), (x+S(6), y+S(52)), (x+S(82), y+S(38))], fill=INK)
        d.line([(x, y-S(34)), (x, y+S(54))], fill=cor, width=max(6, S(8)))
    elif kind == 'entretenimentos':   # raio
        d.polygon([(x+S(14), y-S(80)), (x-S(52), y+S(8)), (x-S(4), y+S(8)), (x-S(16), y+S(80)), (x+S(54), y-S(14)), (x+S(4), y-S(14))], fill=INK)
    elif kind == 'resumo':     # folha com linhas
        d.rounded_rectangle((x-S(52), y-S(68), x+S(52), y+S(68)), radius=S(14), fill=INK)
        for dy in (-34, -8, 18): d.line([(x-S(30), y+S(dy)), (x+S(30), y+S(dy))], fill=cor, width=max(6, S(10)))
        d.line([(x-S(30), y+S(44)), (x+S(4), y+S(44))], fill=cor, width=max(6, S(10)))
    elif kind == 'quiz':       # marca de acerto
        d.line([(x-S(58), y+S(4)), (x-S(16), y+S(48)), (x+S(62), y-S(46))], fill=INK, width=max(10, S(26)), joint='curve')
    elif kind == 'dashboard':  # barras
        for i, h in enumerate((44, 82, 62)):
            bx = x-S(66)+i*S(48); d.rounded_rectangle((bx, y+S(56)-S(h), bx+S(34), y+S(56)), radius=S(8), fill=INK)

def icone(kind=None, cor=None, grande=False):
    im = tile(BASE)
    if not kind: return im
    d = ImageDraw.Draw(im)
    (x, y), R, k = ((338, 338), 172, 1.4) if grande else ((372, 372), 122, 1.0)
    d.ellipse((x-R-12, y-R-12, x+R+12, y+R+12), fill=(7, 9, 16, 255)); d.ellipse((x-R, y-R, x+R, y+R), fill=cor)
    glifo(d, kind, x, y, k, cor); return im

def escrever_ico(path, pequeno, grande, tamanhos=(16, 24, 32, 48, 64, 128, 256)):
    ents = []
    for s in tamanhos:
        b = io.BytesIO(); (pequeno if s <= 32 else grande).resize((s, s), Image.LANCZOS).save(b, 'PNG', optimize=True); ents.append((s, b.getvalue()))
    out = struct.pack('<HHH', 0, 1, len(ents)); off = 6+16*len(ents); data = b''
    for s, png in ents:
        out += struct.pack('<BBBBHHII', s % 256, s % 256, 0, 0, 1, 32, len(png), off+len(data)); data += png
    path.parent.mkdir(parents=True, exist_ok=True); path.write_bytes(out+data)

AREAS = {   # pasta/arquivo : (glifo, cor)  — cores = paleta do quick-access.js
    'resumo/resumo.ico':                          ('resumo',          (79, 168, 232, 255)),
    'quiz/quiz.ico':                              ('quiz',            (61, 220, 132, 255)),
    'dashboard/dashboard.ico':                    ('dashboard',       (108, 99, 255, 255)),
    'games/games.ico':                            ('games',           (255, 181, 71, 255)),
    'games/estudos/estudos.ico':                  ('estudos',         (77, 217, 180, 255)),
    'games/entretenimentos/entretenimentos.ico':  ('entretenimentos', (255, 79, 123, 255)),
}
if __name__ == '__main__':
    for rel, (kind, cor) in AREAS.items(): escrever_ico(OUT/rel, icone(kind, cor, True), icone(kind, cor))
    geral = icone(); escrever_ico(OUT/'favicon.ico', geral, geral)
    geral.resize((16, 16), Image.LANCZOS).save(OUT/'favicon-16x16.png'); geral.resize((32, 32), Image.LANCZOS).save(OUT/'favicon-32x32.png')
    BASE.resize((180, 180), Image.LANCZOS).save(OUT/'apple-touch-icon.png')      # iOS aplica o próprio arredondamento
    geral.resize((192, 192), Image.LANCZOS).save(OUT/'android-chrome-192x192.png'); geral.save(OUT/'android-chrome-512x512.png')
    (OUT/'site.webmanifest').write_text(json.dumps({'name': 'Nexus Study', 'short_name': 'Nexus', 'icons': [
        {'src': 'android-chrome-192x192.png', 'sizes': '192x192', 'type': 'image/png'},
        {'src': 'android-chrome-512x512.png', 'sizes': '512x512', 'type': 'image/png'}],
        'theme_color': '#07080c', 'background_color': '#07080c', 'display': 'standalone'}, ensure_ascii=False, indent=2), encoding='utf8')
    print('favicons gerados em', OUT)
