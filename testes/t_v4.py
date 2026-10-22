import sys; sys.path.insert(0,'.')
from h import *
RES=[]
def chk(ok,msg,det=''):
    RES.append(bool(ok)); print(('  ✔ ' if ok else '  ✘ ')+msg+('' if ok else f'   ← {det}'))
CLA={'uid':'ana','claims':{'nx':True}}
G={'show_milhao':('show_milhao','show_milhao','.game-header__name','show_milhao_data.js'),
   'vdd_falso':('vdd_falso','vdd_falso','.game-header__name','vdd_falso_data.js'),
   'completar_frase':('completar_frase','completar_frase','.game-header__name','completar_frase_data.js'),
   'flashcard':('flashcard','flashcards','.header__name','cards_data.js'),
   'associacao':('associacao','associacao','.assoc-topbar__name','associacao_data.js')}
def url(g,sem,disc='analise_projeto',extra=''):
    return f'games/jogos/estudo/{g}/{g}.html?disc={disc}&sem={sem}{extra}'
async def abre(p,port,path,w=1100,h=800,wait=2200):
    b,ctx=await novo(p,port,init_script(ANA,CLA,200))
    pg=await ctx.new_page(); await pg.set_viewport_size({'width':w,'height':h})
    errs=[]; reqs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.on('request',lambda r:reqs.append(r.url.split('127.0.0.1:%d'%port)[-1].split('?')[0]))
    await pg.goto(f'http://127.0.0.1:{port}/{path}'); await pg.wait_for_timeout(wait)
    return b,pg,errs,reqs
async def vis_texto(pg):
    return await pg.evaluate("document.body.innerText")
async def main():
    SITE=preparar_site()
    s,port=serve(SITE)
    async with async_playwright() as p:
        print('\n[1] Conteúdo: AP1 carrega do caminho novo content/games/<jogo>/2026.2/AP1/ (simulado; sem Firebase real)')
        for g,(gid,pasta,tit,arq) in G.items():
            b,pg,errs,reqs=await abre(p,port,url(g,'2026.2-AP1'))
            novo_c=f'/content/games/{pasta}/2026.2/AP1/{arq}'
            chk(novo_c in reqs,f'{g}: pediu {novo_c}',[r for r in reqs if 'content' in r])
            chk(not any(r for r in reqs if '/content/games/' in r and '/2026/' in r),f'{g}: não pediu mais o caminho antigo (…/2026/…)')
            chk(not any('associacao_data.js' in r and '/estudo/associacao/' in r for r in reqs),f'{g}: não importa o associacao_data.js antigo' if g=='associacao' else f'{g}: (n/a)')
            chk(not errs,f'{g}: sem erro de JavaScript',errs)
            await b.close()
        print('\n[2] AP2 é tratada como outra avaliação (arquivo diferente) — usa fixture AP2 só no site de teste')
        for g,(gid,pasta,tit,arq) in G.items():
            b,pg,errs,reqs=await abre(p,port,url(g,'2026.2-AP2'))
            chk(f'/content/games/{pasta}/2026.2/AP2/{arq}' in reqs and f'/content/games/{pasta}/2026.2/AP1/{arq}' not in reqs,f'{g}: 2026.2-AP2 → pasta AP2 (e não AP1)')
            # ?ap= explícito tem prioridade
            await b.close()
        b,pg,errs,reqs=await abre(p,port,url('vdd_falso','2026.2-AP1','analise_projeto','&ap=AP2'))
        chk('/content/games/vdd_falso/2026.2/AP2/vdd_falso_data.js' in reqs,'?ap=AP2 explícito prevalece sobre sem=…-AP1'); await b.close()
        print('\n[3] Conteúdo ausente → mensagem clara na tela (nunca banco vazio em silêncio)')
        casos=[('AP inexistente (2026.2-AP3)','2026.2-AP3','analise_projeto','Ainda não há conteúdo'),
               ('semestre sem pasta (2026.1-AP1)','2026.1-AP1','analise_projeto','Ainda não há conteúdo'),
               ('sem avaliação (2026.2)','2026.2','analise_projeto','Escolha a avaliação'),
               ('disciplina sem conteúdo (poo)','2026.2-AP1','poo','Sem conteúdo para esta disciplina')]
        for g in G:
            for nome,sem,disc,frag in casos:
                b,pg,errs,reqs=await abre(p,port,url(g,sem,disc),wait=800)
                try: await pg.wait_for_function('(f)=>document.body.innerText.includes(f)',arg=frag,timeout=15000)
                except Exception: pass
                t=await vis_texto(pg)
                chk(frag in t and not errs,f'{g} — {nome}: mostra "{frag}"',(t[:160].replace('\n',' '),errs)); await b.close()
        print('\n[4] Jogabilidade com o conteúdo de teste (AP1)')
        b,pg,errs,reqs=await abre(p,port,url('vdd_falso','2026.2-AP1')); t=await vis_texto(pg)
        await pg.click('#btn-start'); await pg.wait_for_timeout(800)
        t=await vis_texto(pg); chk('[TESTE]' in t,'V/F: pergunta de teste aparece após Começar',t[:120]); await pg.click('#btn-true'); await pg.wait_for_timeout(700)
        chk(not errs,'V/F: respondeu sem erro',errs); await b.close()
        b,pg,errs,reqs=await abre(p,port,url('completar_frase','2026.2-AP1')); await pg.click('#btn-start'); await pg.wait_for_timeout(800)
        t=await vis_texto(pg); chk('[TESTE]' in t,'Complete a Frase: frase de teste aparece',t[:120]); chk(not errs,'CF: sem erro',errs); await b.close()
        b,pg,errs,reqs=await abre(p,port,url('show_milhao','2026.2-AP1')); await pg.click('#btn-start'); await pg.wait_for_timeout(1200)
        t=await vis_texto(pg); chk('[TESTE]' in t,'Show do Milhão: pergunta de teste aparece',t[:120]); chk(not errs,'SM: sem erro',errs); await b.close()
        b,pg,errs,reqs=await abre(p,port,url('flashcard','2026.2-AP1')); t=await vis_texto(pg)
        n=await pg.inner_text('#intro-card-count'); chk(n.strip()=='4','Flashcard: intro mostra 4 cards de teste',n); chk(not errs,'FC: sem erro',errs); await b.close()
        b,pg,errs,reqs=await abre(p,port,url('associacao','2026.2-AP1')); t=await vis_texto(pg)
        chk(await pg.locator('#btn-start').is_visible(),'Associação: tela de início com botão Começar visível'); await pg.click('#btn-start'); await pg.wait_for_timeout(900)
        t=await vis_texto(pg); chk('[TESTE]' in t,'Associação: termos de teste aparecem',t[:140]); chk(not errs,'Assoc: sem erro',errs); await b.close()
        print('\n[5] Título centralizado (centro do nome vs centro da janela, tolerância 2 px)')
        for w,h,nome in [(1280,800,'desktop'),(390,780,'celular')]:
            for g,(gid,pasta,tit,arq) in G.items():
                b,pg,errs,reqs=await abre(p,port,url(g,'2026.2-AP1'),w,h,1800)
                r=await pg.evaluate("(s)=>{const e=document.querySelector(s); if(!e) return null; const b=e.getBoundingClientRect(); return {cx:b.left+b.width/2, vw:document.documentElement.clientWidth, w:b.width}}",tit)
                ok=r and abs(r['cx']-r['vw']/2)<=2
                chk(ok,f'{g} {nome}: centro do título {r and round(r["cx"],1)} vs janela {r and r["vw"]/2}',r)
                await pg.screenshot(path=f'{ROOT}/v4_{g}_{nome}.png'); await b.close()
        print('\n[6] Botão de som (#audio-btn-global) — um só, estilizado, com estado e nome acessível')
        for g in G:
            b,pg,errs,reqs=await abre(p,port,url(g,'2026.2-AP1'),1280,800,1500)
            try: await pg.wait_for_selector('#audio-btn-global',timeout=15000)
            except Exception: pass
            n=await pg.locator('#audio-btn-global').count()
            info=await pg.evaluate("()=>{const e=document.querySelector('#audio-btn-global'); if(!e) return null; const c=getComputedStyle(e),b=e.getBoundingClientRect(); return {pos:c.position,w:Math.round(b.width),h:Math.round(b.height),state:e.dataset.state,label:e.getAttribute('aria-label')||e.title||'',inview:b.right<=innerWidth&&b.bottom<=innerHeight&&b.left>=0&&b.top>=0}}")
            chk(n==1 and info and info['pos']=='fixed' and info['w']>=40 and info['inview'],f'{g}: 1 botão, fixo, {info and info["w"]}px, dentro da tela',info)
            chk(info and info['label'],f'{g}: nome acessível = "{info and info["label"]}"')
            if info:
                s0=info['state']; await pg.click('#audio-btn-global'); await pg.wait_for_timeout(400)
                s1=await pg.evaluate("document.querySelector('#audio-btn-global').dataset.state")
                chk(s0!=s1,f'{g}: clique troca o estado ({s0} → {s1})')
            await pg.screenshot(path=f'{ROOT}/v4_{g}_som.png'); await b.close()
        print('\n[7] Rastreador de tempo (session-tracker) — carregado uma vez por página, sem erro')
        for g in G:
            b,pg,errs,reqs=await abre(p,port,url(g,'2026.2-AP1'))
            n=len([r for r in reqs if r.endswith('/src/session-tracker.js')])
            chk(n==1 and not errs,f'{g}: session-tracker.js pedido {n}x, sem erro',errs); await b.close()
        b,pg,errs,reqs=await abre(p,port,'games/jogo.html'); n=len([r for r in reqs if r.endswith('/src/session-tracker.js')])
        chk(n==1 and not errs,f'hub: session-tracker.js pedido {n}x, sem erro',errs); await b.close()
        print('\n[8] Hub → jogo: o semestre+AP do seletor chega ao jogo dentro de ?sem=')
        b,pg,errs,reqs=await abre(p,port,'games/jogo.html?sem=2026.2-AP1')
        await pg.click('.card[data-id="flashcard"] >> nth=0'); await pg.wait_for_timeout(800); await pg.click('.disc >> nth=0'); await pg.wait_for_timeout(2500)
        chk('sem=2026.2-AP1' in pg.url and '/flashcard/flashcard.html' in pg.url,'clique real no hub abre o Flashcard com sem=2026.2-AP1',pg.url); await b.close()
        print('\n[9] Tamanho dos botões de IA e som = tela inicial de Games + 2 px (zoom da área "game" = 80 %)')
        b,pg,errs,reqs=await abre(p,port,'games/jogo.html?sem=2026.2-AP1',1280,800,3000)
        ref=await pg.evaluate("(()=>{const f=document.querySelector('#nexus-fab').getBoundingClientRect(), a=document.querySelector('#audio-btn-global').getBoundingClientRect(); return {ia:f.width,som:a.width}})()")
        await b.close(); print('   referência (hub):',ref)
        for g in G:
            for w in (1280,390):
                b,pg,errs,reqs=await abre(p,port,url(g,'2026.2-AP1'),w,800,1500)
                try: await pg.wait_for_selector('#audio-btn-global',timeout=15000); await pg.wait_for_selector('#nexus-fab',timeout=15000)
                except Exception: pass
                m=await pg.evaluate("(()=>{const f=document.querySelector('#nexus-fab').getBoundingClientRect(), a=document.querySelector('#audio-btn-global').getBoundingClientRect(); return {ia:f.width,som:a.width,iaR:innerWidth-f.right,iaB:innerHeight-f.bottom,somB:innerHeight-a.bottom,gap:f.top-a.bottom,alinhados:Math.abs((innerWidth-f.right)-(innerWidth-a.right))<1}})()")
                chk(abs(m['ia']-(ref['ia']+2))<=0.6 and abs(m['som']-(ref['som']+2))<=0.6,f'{g} {w}px: IA {m["ia"]:.1f} e som {m["som"]:.1f} = referência {ref["ia"]:.1f} + 2',m)
                chk(m['alinhados'] and 6<=m['gap']<=20 and m['iaR']>=8,f'{g} {w}px: botões alinhados em coluna, espaçamento {m["gap"]:.1f}px, dentro da tela',m)
                await b.close()
        print('\n[10] Botão Nexus → página inicial geral (21 jogos) e Voltar preservado')
        import glob as _g
        raizjogos=os.path.join(SITE,'games','jogos')
        todos=[('estudo',x) for x in G]  # 5 de estudo
        ent=sorted(_g.glob(os.path.join(raizjogos,'entretenimento','*','*','*.html')))
        casos=[(f'estudo/{g}',url(g,'2026.2-AP1'),'games/jogo.html') for g in G]+[('entretenimento/'+os.path.basename(e)[:-5],os.path.relpath(e,os.path.join(SITE)).replace(os.sep,'/'),'games/jogo.html') for e in ent]
        for nome,path,destino_voltar in casos:
            b,pg,errs,reqs=await abre(p,port,path,1280,800,1500)
            home=await pg.evaluate("document.querySelector('.nx-nav__home')?.href||''")
            txt=await pg.evaluate("document.querySelector('.nx-nav a.back, .nx-nav .game-header__back, .nx-nav .back-btn, .nx-nav .assoc-back-btn')?.innerText.trim()||''")
            vhref=await pg.evaluate("document.querySelector('.nx-nav a.back, .nx-nav .game-header__back, .nx-nav .back-btn')?.getAttribute('href')||'(botão)'")
            chk(home.endswith(f':{port}/index.html'),f'{nome}: botão Nexus aponta para a página inicial geral',home)
            chk(txt=='Voltar',f'{nome}: texto do botão = "{txt}"')
            if nome.startswith('entretenimento'): chk(vhref.endswith('jogo.html') and 'index.html' not in vhref,f'{nome}: Voltar continua indo para o menu de jogos ({vhref})')
            await pg.click('.nx-nav__home'); await pg.wait_for_timeout(900)
            chk(pg.url.split('?')[0].endswith(f':{port}/index.html'),f'{nome}: clique no Nexus abre index.html',pg.url)
            await b.close()
        print('\n[11] Favicons por área: o <link> está no HTML E continua certo depois que a página carrega (logo.js etc. não pode trocá-lo)')
        F='shared/img/favicons/'
        areas=[('index (geral)','index.html',F+'favicon.ico'),('resumo','resumo/resumo.html',F+'resumo/resumo.ico'),('quiz','quiz/quiz.html',F+'quiz/quiz.ico'),
               ('dashboard','dashboard/dashboard.html',F+'dashboard/dashboard.ico'),('games (hub)','games/jogo.html?sem=2026.2-AP1',F+'games/games.ico')]
        areas+=[(f'estudo/{g}',url(g,'2026.2-AP1'),F+'games/estudos/estudos.ico') for g in G]
        areas+=[('entretenimento/'+os.path.basename(e)[:-5],os.path.relpath(e,SITE).replace(os.sep,'/'),F+'games/entretenimentos/entretenimentos.ico') for e in ent]
        for nome,path,ico in areas:
            fonte=open(os.path.join(SITE,path.split('?')[0]),encoding='utf8').read()
            chk(ico.split('/')[-1] in fonte and 'favicon_io' not in fonte,f'{nome}: o HTML referencia {ico} e não referencia favicon_io')
            b,pg,errs,reqs=await abre(p,port,path,1280,800,2500)
            hrefs=await pg.evaluate("[...document.querySelectorAll('link[rel~=icon]')].map(l=>l.href)")
            chk(any(h.endswith('/'+ico) for h in hrefs),f'{nome}: depois de carregar, o ícone ativo ainda é {ico}',hrefs)
            import urllib.request
            try:
                with urllib.request.urlopen(f'http://127.0.0.1:{port}/'+ico,timeout=10) as resp: r={'s':resp.status,'n':','.join(str(x) for x in resp.read(4))}
            except Exception as e: r={'s':-1,'n':str(e)}
            chk(r['s']==200 and r['n']=='0,0,1,0',f'{nome}: o .ico baixa (200) e tem assinatura .ico',r)
            await b.close()
        print('\n[12] Ícone Nexus do hub = componente do Quiz (glow do logo.css)')
        b,pg,errs,reqs=await abre(p,port,'games/jogo.html?sem=2026.2-AP1',1280,800,2500)
        bs=await pg.evaluate("getComputedStyle(document.querySelector('#sidebar-logo-wrap .nexus-logo__img')).boxShadow")
        chk('77, 217, 180' in bs,'hub: ícone Nexus tem o brilho verde do logo.css',bs); await b.close()
    print(f'\nRESULTADO: {sum(RES)}/{len(RES)} verificações OK'); sys.exit(0 if all(RES) else 1)
import asyncio; asyncio.run(main())
