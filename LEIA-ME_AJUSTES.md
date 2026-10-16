# Ajustes após a migração — como aplicar e testar (Windows / PowerShell)

## O que mudou (só estes arquivos)
- `src/core/auth.js` — login: se digitar o PIN antigo (ex.: `321`), o site completa com `000` e valida no Firebase Authentication. Só vale se a conta ainda estiver com troca de senha obrigatória; depois de trocar, `321`/`321000` não entram mais. Senhas livres (só números, só letras ou mistas), 6 a 30 caracteres.
- `src/firebase.js`, `src/data/usuarios-repo.js` — removido o código que gerava hash de PIN (não era usado no login).
- `index.js` — rótulo "PIN" do perfil virou "Senha"; dica de primeiro acesso no login.
- `scripts/migracao/remover-pins.mjs` — NOVO: apaga SÓ o campo `pin` dos documentos de `usuarios`.
- `testes_login/` — testes novos/atualizados (agora 20 cenários).

## Auditoria
O login NUNCA lê o campo `pin` do Firestore, e o Worker não tem lógica de PIN. Se o PIN antigo ainda entrava no seu navegador, era o site antigo em cache/publicado (veja no DevTools → Network se há chamada `signInWithPassword`).

## Ordem recomendada
1. Copie os arquivos para o projeto (mesmos caminhos).
2. Rode os testes (abaixo).
3. Publique o front novo (você faz o commit/publicação).
4. Teste o login: `321` deve ir direto à troca de senha.
5. Só depois, remova os PINs: simulação → `--executar`.
6. Firebase Console → Authentication → Settings → Password policy: confirme que NÃO exige maiúscula/número/símbolo (não consegui verificar).

## Testes (usa emulador local; NÃO toca produção)
Pasta: `testes_login`. Comando: `node rodar_tudo.mjs`. Esperado: `20 de 20 cenários passaram`. (Precisa do emulador do Auth ligado, como no LEIA-ME anterior.)

## Remover o campo pin (altera o Firestore de verdade quando usado com --executar)
Pasta: `scripts\migracao`
```
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\chaves\nexus-admin.json"
node remover-pins.mjs
```
Simulação: lista o que seria feito, não altera nada. Para valer:
```
node remover-pins.mjs --executar
```
Digite `REMOVER` quando pedir. Só apaga o campo `pin`; pula quem não tem conta migrada; gera relatório sem hashes. Faça backup antes.
Erros comuns: "Sem acesso ao Authentication" → defina GOOGLE_APPLICATION_CREDENTIALS com a chave "Firebase Admin SDK"; HTTP 403 → essa chave não tem permissão no Firestore, use a "Firebase Admin SDK"; leitura recusada → regras do Firestore não permitem leitura pública (não altero regras sem sua aprovação).
