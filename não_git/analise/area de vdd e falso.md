🐛 Bugs encontrados

BUG CRÍTICO
sorteiarPonderado() pode entrar em loop infinito
vdd_falso.js:58
Se rand chegar exatamente a zero após subtrair todos os pesos (arredondamento de ponto flutuante), o for termina sem dar break e nada é adicionado a sel. O while externo tenta de novo indefinidamente — com o mesmo pool — travando o browser.

// loop externo nunca termina se rand expirar sem hit
for (let i = 0; i < pool.length; i++) {
  rand -= pool[i].peso;
  if (rand <= 0) { sel.push(pool[i].item); pool.splice(i,1); break; }
}
// Garante fallback: se nenhum item foi selecionado, pega o último
let hit = false;
for (let i = 0; i < pool.length; i++) {
  rand -= pool[i].peso;
  if (rand <= 0) { sel.push(pool[i].item); pool.splice(i, 1); hit = true; break; }
}
if (!hit) { sel.push(pool[pool.length-1].item); pool.splice(pool.length-1,1); }
BUG
finalizarJogo() inclui tempo esgotado como acerto no cálculo de "Precisão"
vdd_falso.js:finalizarJogo
O array resultados é construído comparando respostas[i] === p.resposta. Quando a resposta é null (tempo esgotado), null === true e null === false são ambos false — então acertou fica false. Isso é correto para o storage, mas o cálculo pct = acertos / total * 100 usa estado.acertos, que já exclui o tempo. O problema real: questões com tempo esgotado inflam total (denominador) sem contribuir para acertos, derrubando a precisão injustamente. Semanticamente, deveriam ser excluídas ou tratadas separadamente.

const pct = Math.round((estado.acertos / total) * 100);
// total inclui questões não respondidas (tempo esgotado)
const respondidas = estado.respostas.filter(r => r !== null && r !== undefined).length;
const pct = respondidas > 0
  ? Math.round((estado.acertos / respondidas) * 100)
  : 0;
BUG
MutationObserver em #vf-disc-tag cria loop de observação
vdd_falso.html — script inline, observer 3
#vf-disc-label é filho de #vf-disc-tag. O observer escuta childList + characterData + subtree: true no pai e escreve em discLbl.textContent — que é filho do pai observado. Isso dispara o observer de novo, criando um loop de notificações. Embora a maioria dos browsers tenha proteção contra loops síncronos, gera notificações desnecessárias e pode causar comportamento imprevisível.

// Observa o pai e escreve no filho (filho é subtree do pai) → loop
new MutationObserver(() => {
  discLbl.textContent = discTag.textContent || '—';
}).observe(discTag, { childList: true, characterData: true, subtree: true });
// Observa apenas atributo externo, ou observe o pai sem subtree
// e leia somente filhos diretos não-label:
new MutationObserver(() => {
  const txt = [...discTag.childNodes]
    .filter(n => n !== discLbl)
    .map(n => n.textContent).join('').trim();
  discLbl.textContent = txt || '—';
}).observe(discTag, { childList: true });
⚠️ Problemas potenciais

POTENCIAL
init() registrado no DOMContentLoaded, mas o HTML já tem outro DOMContentLoaded
vdd_falso.html + vdd_falso.js
O script inline no HTML registra listeners em DOMContentLoaded. O módulo vdd_falso.js (carregado com type="module" após o inline) também registra init em DOMContentLoaded. Módulos type="module" são sempre defer — quando o módulo executa, DOMContentLoaded pode já ter disparado, fazendo o listener do módulo nunca ser chamado em alguns cenários de cache/navegação rápida.

document.addEventListener('DOMContentLoaded', init); // pode não disparar
// Em módulos, DOMContentLoaded já disparou quando o script roda.
// Use diretamente:
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
tipo=module é sempre defer
risco em navegação via history.back
POTENCIAL
montarDeck() pode retornar menos que MAX_QUESTOES sem aviso
vdd_falso.js:montarDeck
A lógica garante 1 questão por aula na primeira passagem. Se o banco tiver apenas 3 aulas com 1 questão cada, e MAX_QUESTOES = 8, a segunda passagem tenta completar com o restante — mas se o banco tiver menos questões que o máximo, estado.perguntas terá menos de 8 itens. O atualizarContadores() exibe o número correto, mas o HTML inicial hardcoda "8" no badge #intro-total-questoes antes do init, podendo confundir por 1 frame.

// Após montarDeck, validar:
if (estado.perguntas.length === 0) {
  mostrarTela('empty');
  return;
}
POTENCIAL
Atalho ArrowLeft navega mesmo com questão em andamento (timer ativo)
vdd_falso.js:registrarAtalhos
ArrowLeft chama irAnterior() sem verificar se a questão atual já foi respondida. O usuário pode pressionar ← enquanto o timer corre, pular para a questão anterior (que dispara um novo timer), e o timer da questão abandonada continua rodando em estado.timer — que é sobrescrito em renderizarQuestao() apenas na criação, não em irAnterior. O estado.timer?.stop() está em renderizarQuestao(), então na prática funciona, mas o timer da questão pulada ainda dispara onEnd se a navegação for rápida antes do stop ser chamado (race condition de 1 frame).

case 'ArrowLeft': e.preventDefault(); irAnterior(); break;
case 'ArrowLeft':
  e.preventDefault();
  estado.timer?.stop(); // para explicitamente antes de navegar
  irAnterior();
  break;
POTENCIAL
salvarResultadoVF() com tempo esgotado salva acertou: false no histórico
storage_vf.js + vdd_falso.js:finalizarJogo
Em finalizarJogo, questões com tempo esgotado (respostas[i] === null) geram { id, acertou: false } porque null === p.resposta é sempre false. Em salvarResultadoVF, isso incrementa entrada.erros++ e entrada.tentativas++ — o que distorce o histórico e o algoritmo de peso ponderado nas sessões futuras.

const resultados = estado.perguntas.map((p, i) => ({
  id: p.id,
  acertou: estado.respostas[i] === p.resposta,
}));
const resultados = estado.perguntas
  .map((p, i) => ({ id: p.id, resp: estado.respostas[i], acertou: estado.respostas[i] === p.resposta }))
  .filter(r => r.resp !== null && r.resp !== undefined); // exclui tempo esgotado
POTENCIAL
togglePausa() não desativa atalhos de teclado V/F/Enter durante pausa
vdd_falso.js:registrarAtalhos
registrarAtalhos() verifica estado.pausado e retorna cedo — correto. Mas o listener de Space para pausar está em setupPausa(), em um handler separado, que não verifica se já está no overlay de pausa antes de chamar togglePausa(). Se o botão "Retomar" do overlay receber foco, pressionar Space faz toggle duplo (pausa → despausa imediatamente).

// Em setupPausa, no keydown do Space:
if (e.code === 'Space') {
  if (document.activeElement?.id === 'btn-retomar') return; // evita toggle duplo
  ...
}
🔧 Outras correções pontuais

CORREÇÃO
innerHTML em atualizarBotoesNav() redefine listeners do botão Próxima
vdd_falso.js:atualizarBotoesNav
el.btnProxima.innerHTML = ... é chamado a cada renderização. Isso destrói e recria o DOM interno do botão, mas o listener foi adicionado via addEventListener diretamente no elemento — não no innerHTML — então sobrevive. Sem bug ativo, mas padrão frágil: qualquer futuro listener adicionado via onclick ou em filho do botão seria perdido. Melhor atualizar só o texto/svg interno separadamente.

DÚVIDA
renderizarQuestao() não congela a barra de timer ao revisar questão respondida
vdd_falso.js:renderizarQuestao
O comentário diz "mantém a barra congelada onde estava — não zera", mas a barra usa a CSS custom property --timer-pct controlada pelo Timer que parou. Se o usuário navegar entre questões respondidas, --timer-pct nunca é atualizada para refletir o estado daquela questão específica — a barra mostra o valor do último timer ativo. Pode ser intencional, mas parece um edge case visual não resolvido.

Análise concluída. Resumo dos pontos críticos:
Bug mais grave: o sorteiarPonderado() tem um path onde o loop for percorre todo o array sem dar break (quando rand expira por arredondamento de ponto flutuante), e o while externo entra em loop infinito travando o browser. A correção é adicionar um fallback para o último elemento.
Segundo mais impactante: questões com tempo esgotado (null) são salvas no histórico como erros, o que contamina o algoritmo ponderado de seleção nas sessões seguintes — o bug 1 foi "corrigido" na pontuação em jogo, mas não no storage.
Sobre o type="module": em SPAs ou quando o usuário navega para a página via history.back(), o DOMContentLoaded pode já ter disparado quando o módulo executa. A troca por readyState === 'loading' é simples e elimina o risco.
Os demais pontos (observer em loop, race condition no timer com ArrowLeft, Space duplo no overlay) são menos urgentes mas valem correção antes de escalar para mais usuários.







🧠 Correções aplicadas:
Bugs críticos:

sorteiarPonderado() — adicionado flag hit + fallback para o último elemento do pool quando rand expira por arredondamento de ponto flutuante; elimina o loop infinito no while
finalizarJogo() — precisão agora calculada sobre respondidas (questões com resp !== null && resp !== undefined), não sobre total; tempo esgotado não deflaciona mais a porcentagem
MutationObserver em #vf-disc-tag — reescrito sem subtree: true, lendo apenas nós filhos que não são o discLbl; loop de notificações eliminado

Potenciais:

init() — DOMContentLoaded substituído por verificação de readyState === 'loading', garantindo execução em history.back() e navegação com cache
irAnterior() e atalho ArrowLeft — estado.timer?.stop() chamado explicitamente antes de navegar, eliminando a race condition de 1 frame
togglePausa() — guard if (document.activeElement?.id === 'btn-retomar') return no listener de Space, prevenindo o toggle duplo pausa→despausa
montarDeck() — validação de deck vazio adicionada em init(), onRejogo e btnVoltarIntro, redirecionando para a tela empty se necessário
storage_vf.js — salvarResultadoVF() filtra resultadosValidos excluindo resp === null como defesa em profundidade, além do filtro já aplicado no caller em vdd_falso.js