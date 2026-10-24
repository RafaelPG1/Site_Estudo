# Commit e merge para a main (você executa; eu não publico)

## Mensagem de commit
```
feat(games): favicon por jogo, som no Voltar/Nexus e botão de som nos 21 jogos

- favicon próprio para cada jogo (estudo e entretenimento) em shared/img/favicons/games/
- remove a injeção automática de favicons do logo.js (v2.3) e a pasta favicon_io
- botão Nexus dos jogos com o mesmo visual do ícone do hub
- som (hover/clique) nos botões Voltar e Nexus; botão de efeito sonoro também nos jogos de entretenimento (sem a IA)
- ferramentas: favicons_jogos.py, favicons_migrar.py, jogos_som.py; testes atualizados
```

## Passo a passo (terminal na pasta do projeto)
```
git status                                   # confira o que mudou
git diff --stat                              # resumo do diff
git add -A
git commit                                   # cole a mensagem acima
git push -u origin feat/jogos-favicons-som   # envia a branch
```
Depois, no GitHub: **Compare & pull request** → base `main` → **Merge pull request**
(ou pelo terminal: `git switch main && git pull && git merge --no-ff feat/jogos-favicons-som && git push`).
Antes do merge, rode `python ferramentas/favicons_migrar.py verificar` e abra 2 ou 3 jogos.
Se algo estranho aparecer: `git restore <arquivo>` (antes do commit) ou `git revert <commit>` (depois do merge).
