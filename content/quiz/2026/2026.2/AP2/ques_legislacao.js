// ============================================================
// NEXUS STUDY — quiz/conteudo/2026.2/AP1/ques_legislacao.js
// ============================================================
window.questoes = {

  // Questões de Banco de dados 
  questoes: [

    // ===== AULA 9 =====
// 1 - Sócio e empresário
{
  aula: "Aula 9 - Sociedades",
  tipo: "Explicativa",
  texto: "Uma sociedade nasce da união de interesses de pelo menos duas pessoas, os sócios. O sócio, pessoa física ou jurídica, colabora com o capital social, que pode ser formado por dinheiro, bens ou serviços. Mas sócio não é empresário: a atividade empresária é exercida pela pessoa jurídica, a sociedade, e os sócios apenas a representam e assinam por ela.",
  question: "Quem exerce a atividade empresária em uma sociedade empresária?",
  options: [
    "Cada sócio, individualmente, em nome próprio.",
    "A pessoa jurídica, que é a própria sociedade.",
    "Somente o sócio que contribuiu com dinheiro.",
    "O contador responsável pelo registro."
  ],
  answer: 1,
  feedback: "Os sócios originam a pessoa jurídica, mas não se confundem com ela. Eles a representam e assinam por ela."
},
// 2 - Simples x empresária
{
  aula: "Aula 9 - Sociedades",
  tipo: "Explicativa",
  texto: "Segundo o Art. 982 do Código Civil, é empresária a sociedade cujo objeto é o exercício de atividade própria de empresário sujeito a registro, e simples são as demais. A sociedade empresária registra seus atos na Junta Comercial, enquanto a sociedade simples registra no Registro Civil das Pessoas Jurídicas, conforme o Art. 1.150.",
  question: "Onde cada tipo de sociedade deve ser registrado?",
  options: [
    "Empresária no Registro Civil, e simples na Junta Comercial.",
    "As duas na Junta Comercial.",
    "Empresária na Junta Comercial, e simples no Registro Civil das Pessoas Jurídicas.",
    "As duas no Registro Civil das Pessoas Jurídicas."
  ],
  answer: 2,
  feedback: "Se a sociedade simples adotar um dos tipos de sociedade empresária, ela segue as normas daquele registro."
},
// 3 - Registro
{
  aula: "Aula 9 - Sociedades",
  tipo: "Aplicação",
  texto: "Quando a atividade é de produção ou circulação de bens ou serviços de forma organizada, a sociedade é empresária e deve se constituir por um dos tipos previstos no Código Civil. Já as sociedades simples, que exercem atividade econômica sem objeto próprio de empresário, registram-se no cartório de pessoas jurídicas.",
  question: "Dois amigos abrem uma fábrica de móveis, constituindo uma sociedade empresária. Onde devem registrar os atos constitutivos?",
  options: [
    "No Registro Civil das Pessoas Jurídicas.",
    "Na Junta Comercial.",
    "No cartório de protesto.",
    "Em nenhum órgão, pois o registro é facultativo."
  ],
  answer: 1,
  feedback: "A sociedade empresária vincula-se ao Registro Público de Empresas Mercantis, a cargo das Juntas Comerciais."
},
// 4 - Sociedade simples
{
  aula: "Aula 9 - Sociedades",
  tipo: "Contextualizada",
  texto: "Na sociedade simples, o contrato é escrito, e os sócios podem contribuir com serviços. Quanto à responsabilidade, o padrão é a ilimitada, inclusive quando o contrato é silente. Só haverá responsabilidade limitada se houver previsão expressa. Para alterar certas cláusulas, como o capital social e a quota de cada sócio, é necessário o consentimento de todos (Art. 999).",
  question: "Em uma sociedade simples, o contrato social não diz nada sobre a responsabilidade dos sócios. O que vale?",
  options: [
    "A responsabilidade ilimitada, que é o padrão.",
    "A responsabilidade limitada ao valor das quotas.",
    "Nenhuma responsabilidade, pois falta previsão.",
    "A responsabilidade só do sócio administrador."
  ],
  answer: 0,
  feedback: "A responsabilidade limitada exige previsão expressa. Sem ela, vale a regra geral, a ilimitada (Arts. 1.023 e 1.024 e Art. 997, VIII)."
},
// 5 - Sociedade em comum
{
  aula: "Aula 9 - Sociedades",
  tipo: "Explicativa",
  texto: "A sociedade em comum (Arts. 986 a 990 do Código Civil) é aquela que ainda não registrou seus atos constitutivos e, por isso, não tem personalidade jurídica. Seu patrimônio especial é formado por bens e dívidas sociais. Os sócios respondem solidária e ilimitadamente pelas obrigações sociais.",
  question: "Qual é a principal característica da sociedade em comum?",
  options: [
    "Ter personalidade jurídica própria desde o primeiro dia.",
    "Ter capital dividido em ações.",
    "Não ter registro dos atos constitutivos e, por isso, não ter personalidade jurídica.",
    "Ter sócios com responsabilidade sempre limitada."
  ],
  answer: 2,
  feedback: "Ela ainda está em processo de constituição. Pela falta de registro, os sócios respondem de forma solidária e ilimitada."
},
// 6 - Conta de participação
{
  aula: "Aula 9 - Sociedades",
  tipo: "Contextualizada",
  texto: "A sociedade em conta de participação é tratada como contrato especial de investimento. Ela não tem personalidade jurídica, patrimônio próprio nem nome empresarial, e sua constituição independe de formalidade (Art. 992). Tem dois tipos de sócio: o ostensivo, que exerce a atividade e opera frente a terceiros com responsabilidade ilimitada, e o participante, que apenas empresta capital, não aparece a terceiros e responde apenas frente ao ostensivo.",
  question: "Marcos investe dinheiro em um negócio, mas não quer aparecer. Quem opera o negócio é Paula. Em uma conta de participação, qual é a posição de Marcos?",
  options: [
    "Sócio ostensivo, com responsabilidade ilimitada frente a terceiros.",
    "Liquidante da sociedade.",
    "Sócio participante, que responde apenas frente ao sócio ostensivo.",
    "Administrador por ato separado."
  ],
  answer: 2,
  feedback: "O participante é o sócio oculto que empresta capital. Quem aparece e responde frente a terceiros é o ostensivo, no caso Paula."
},
// 7 - LTDA
{
  aula: "Aula 9 - Sociedades",
  tipo: "Aplicação",
  texto: "A sociedade limitada (Arts. 1.052 a 1.086 do Código Civil) tem como principais marcas a limitação de responsabilidade e a contratualidade. Seu capital é dividido em quotas, e a responsabilidade dos sócios é limitada ao valor das quotas, mas todos respondem solidariamente pela integralização do capital. É vedada a contribuição em serviços. O nome empresarial leva o termo limitada ou LTDA.",
  question: "Ana quer entrar em uma sociedade limitada contribuindo apenas com seu trabalho, sem dinheiro nem bens. O que a lei prevê?",
  options: [
    "É permitido, pois toda sociedade aceita serviços como capital.",
    "É permitido, mas só se o nome tiver a sigla LTDA.",
    "É permitido, desde que ela seja a administradora.",
    "É vedado, pois a contribuição de sócio em serviços não é admitida na limitada."
  ],
  answer: 3,
  feedback: "A contribuição em serviços é permitida na sociedade simples, mas vedada na limitada e na S/A."
},
// 8 - Sociedade anônima
{
  aula: "Aula 9 - Sociedades",
  tipo: "Explicativa",
  texto: "A sociedade anônima é regida pela Lei nº 6.404/76, sendo o Código Civil aplicado apenas nas omissões. É sociedade de capital, regida por estatuto social, com capital dividido em ações. A responsabilidade do acionista é limitada ao preço de emissão das ações. É vedada a contribuição em serviços, e o registro é feito na Junta Comercial.",
  question: "Qual alternativa descreve corretamente a sociedade anônima?",
  options: [
    "Capital dividido em quotas e contrato social escrito.",
    "Sem personalidade jurídica e sem registro.",
    "Capital dividido em ações, regida por estatuto e pela Lei nº 6.404/76.",
    "Regida somente pelo Código Civil, sem lei própria."
  ],
  answer: 2,
  feedback: "A divisão em quotas e o contrato social são da limitada. A S/A tem lei própria, a Lei das S/A (LSA)."
},
// 9 - S/A aberta e fechada
{
  aula: "Aula 9 - Sociedades",
  tipo: "Contextualizada",
  texto: "As S/A se dividem em abertas e fechadas, conforme o Art. 4º da LSA. A companhia aberta tem valores mobiliários admitidos à negociação no mercado de valores mobiliários, como a bolsa de valores. Na fechada, os valores mobiliários não são negociados nesse mercado. Entre os valores mobiliários estão as ações, debêntures, partes beneficiárias e bônus de subscrição.",
  question: "Uma empresa quer vender suas ações na bolsa de valores. Que tipo de S/A ela precisa ser?",
  options: [
    "Fechada, pois só ela negocia ações.",
    "Aberta, pois seus valores mobiliários são admitidos no mercado de valores mobiliários.",
    "Comandita simples.",
    "Sociedade em comum."
  ],
  answer: 1,
  feedback: "Só a companhia aberta negocia valores mobiliários no mercado. Na fechada isso não é permitido."
},
// 10 - Comandita por ações
{
  aula: "Aula 9 - Sociedades",
  tipo: "Aplicação",
  texto: "A sociedade em comandita por ações é híbrida, pois mistura características da comandita e da sociedade anônima. Seu capital é dividido em ações. Os sócios diretores, chamados comanditados, respondem de forma ilimitada e solidária (mas subsidiária), e os demais sócios são comanditários. Somente sócios podem administrar.",
  question: "Em uma comandita por ações, Bruno é um sócio diretor. Qual é a consequência para ele?",
  options: [
    "Responde de forma limitada ao valor de suas ações.",
    "Responde de forma ilimitada e solidária, embora subsidiária, pelas obrigações sociais.",
    "Não responde por nada, pois a sociedade tem personalidade.",
    "Responde somente se não houver estatuto."
  ],
  answer: 1,
  feedback: "Os diretores são os comanditados, com responsabilidade ilimitada. Os comanditários, que são os demais sócios, têm responsabilidade limitada."
},
// ===== AULA 10 =====
// 1 - Fases da dissolução
{
  aula: "Aula 10 - Dissolução de sociedades",
  tipo: "Explicativa",
  texto: "Segundo Fábio Ulhôa Coelho, a dissolução é um procedimento de terminação da personalidade jurídica e tem três fases. A primeira é a dissolução propriamente dita, o ato ou fato que desencadeia o fim. A segunda é a liquidação, em que se resolvem as pendências com credores. A terceira é a partilha, em que o patrimônio restante é dividido entre os sócios.",
  question: "Qual é a sequência correta das fases do fim da sociedade?",
  options: [
    "Partilha, liquidação e dissolução.",
    "Liquidação, partilha e dissolução.",
    "Dissolução, partilha e liquidação.",
    "Dissolução, liquidação e partilha."
  ],
  answer: 3,
  feedback: "Primeiro o fato que dá início ao fim, depois o pagamento das dívidas (liquidação) e por fim a divisão do que sobrar (partilha)."
},
// 2 - Dissolução parcial
{
  aula: "Aula 10 - Dissolução de sociedades",
  tipo: "Explicativa",
  texto: "A dissolução parcial atinge a relação de um sócio com a sociedade, mas a empresa continua. Isso decorre do princípio da preservação da empresa: o ideal é a continuidade. As causas são morte do sócio, retirada, exclusão, falência do sócio e liquidação da quota a pedido de credor particular. Já a dissolução total encerra a personalidade jurídica e extingue a sociedade.",
  question: "O que diferencia a dissolução parcial da total?",
  options: [
    "Na parcial a sociedade continua e só um sócio sai; na total a sociedade é extinta.",
    "Na parcial a sociedade é extinta e na total só um sócio sai.",
    "A parcial só ocorre na S/A e a total só na LTDA.",
    "Não há diferença prática entre as duas."
  ],
  answer: 0,
  feedback: "A parcial preserva a empresa e resolve a situação de um sócio. A total termina com a personalidade jurídica da sociedade."
},
// 3 - Morte do sócio
{
  aula: "Aula 10 - Dissolução de sociedades",
  tipo: "Aplicação",
  texto: "A morte do sócio provoca a retirada dele da sociedade, o que é causa de dissolução parcial. Os herdeiros não são obrigados a ingressar na sociedade. Se quiserem entrar no lugar do falecido, precisam da concordância dos demais sócios. Se nenhum quiser ou for aceito, a sociedade resolve sua relação com o falecido.",
  question: "Um sócio faleceu e seu filho quer assumir o lugar dele. O que é necessário?",
  options: [
    "Nada, pois o filho entra automaticamente.",
    "Apenas a decisão do juiz, sem consultar os sócios.",
    "O fim imediato da sociedade.",
    "A concordância dos demais sócios, pois o herdeiro não é obrigado a entrar nem entra sem aceitação."
  ],
  answer: 3,
  feedback: "Entrar ou não é opção do herdeiro, mas o ingresso depende de concordância dos demais, em respeito à vontade de continuidade da empresa."
},
// 4 - Retirada
{
  aula: "Aula 10 - Dissolução de sociedades",
  tipo: "Aplicação",
  texto: "Na retirada de sócio, a regra muda conforme o prazo da sociedade. Nas sociedades por prazo indeterminado, o sócio pode sair a qualquer tempo, devendo avisar os demais com 60 dias de antecedência. Nas sociedades por prazo determinado, o sócio que quiser sair antes do fim precisa comprovar justa causa em juízo.",
  question: "Lia é sócia de uma sociedade por prazo indeterminado e quer sair. O que ela deve fazer?",
  options: [
    "Notificar os demais sócios com antecedência de 60 dias.",
    "Comprovar justa causa em juízo.",
    "Esperar o fim do prazo, que não existe.",
    "Pedir a falência da sociedade."
  ],
  answer: 0,
  feedback: "Ela tem direito de se retirar a qualquer tempo, com aviso prévio de 60 dias. A justa causa judicial é para sociedades por prazo determinado."
},
// 5 - Exclusão de sócio
{
  aula: "Aula 10 - Dissolução de sociedades",
  tipo: "Explicativa",
  texto: "Pode ser excluído o sócio que descumpre sua obrigação de colaborar com a sociedade, como não integralizar sua parte no prazo combinado. A exclusão pode ser extrajudicial quando todos os demais a decidem. Mas, como ensina Fábio Ulhoa, é necessária uma causa prevista em lei, sendo vedada a exclusão pela mera vontade dos demais sócios.",
  question: "Qual é um requisito indispensável para excluir um sócio?",
  options: [
    "Apenas a vontade da maioria, sem necessidade de motivo.",
    "A existência de uma causa prevista em lei, como a falta de integralização.",
    "O pedido de um credor qualquer da sociedade.",
    "A mudança do nome empresarial."
  ],
  answer: 1,
  feedback: "A causa legal é condição inafastável da exclusão. Sem ela, a exclusão por simples vontade dos demais não é possível."
},
// 6 - Credor particular
{
  aula: "Aula 10 - Dissolução de sociedades",
  tipo: "Aplicação",
  texto: "Se um sócio tem dívidas pessoais e não possui outros bens, seu credor particular pode pedir a liquidação da quota dele na sociedade (parágrafo único do Art. 1.026 do Código Civil). O valor é apurado com base em balanço especial e depositado em dinheiro, no juízo da execução, até 90 dias após a liquidação.",
  question: "Um sócio deve a um banco, sem outros bens além de sua participação na sociedade. O que o credor pode fazer?",
  options: [
    "Ocupar a administração da sociedade.",
    "Excluir os demais sócios.",
    "Requerer a liquidação da quota do devedor, com depósito do valor no juízo da execução em até 90 dias.",
    "Cancelar o registro da sociedade."
  ],
  answer: 2,
  feedback: "É uma das causas de dissolução parcial: a sociedade continua, e apenas a quota do sócio devedor é liquidada."
},
// 7 - Dissolução total
{
  aula: "Aula 10 - Dissolução de sociedades",
  tipo: "Explicativa",
  texto: "A dissolução total encerra a sociedade. Entre as causas estão a vontade dos sócios, o vencimento do prazo de duração, o objeto social que se tornou ilícito, a falência, a inexequibilidade do objeto social, a unipessoalidade e a anulação da constituição ou dos registros.",
  question: "Qual alternativa NÃO é causa de dissolução total?",
  options: [
    "Objeto social que se tornou ilícito.",
    "Vencimento do prazo de duração da sociedade.",
    "Anulação da constituição e dos registros.",
    "Retirada de um sócio de sociedade por prazo indeterminado."
  ],
  answer: 3,
  feedback: "A retirada de um sócio é causa de dissolução parcial. As demais levam ao fim da sociedade."
},
// 8 - Unipessoalidade
{
  aula: "Aula 10 - Dissolução de sociedades",
  tipo: "Contextualizada",
  texto: "A unipessoalidade ocorre quando todas as quotas de uma sociedade contratual passam a pertencer a uma só pessoa. O Art. 1.033, inciso IV, do Código Civil dá um prazo de 180 dias para reconstituir a pluralidade de sócios. Se isso não for feito, a sociedade é dissolvida e entra em liquidação.",
  question: "Em uma sociedade de dois sócios, um deles saiu e o outro ficou sozinho. O que a lei prevê?",
  options: [
    "A sociedade dissolve imediatamente, sem prazo.",
    "A sociedade continua para sempre com um único sócio.",
    "A sociedade tem 180 dias para recompor a pluralidade; se não o fizer, é dissolvida.",
    "O sócio remanescente deve pagar multa e a sociedade continua."
  ],
  answer: 2,
  feedback: "Ao fim dos 180 dias sem pluralidade de sócios, a sociedade se desfaz e entra em liquidação."
},
// 9 - Liquidação e liquidante
{
  aula: "Aula 10 - Dissolução de sociedades",
  tipo: "Contextualizada",
  texto: "A liquidação é a fase posterior à dissolução, em que se levanta o patrimônio da sociedade, pagam-se as dívidas e só então se divide o que sobrar entre os sócios. Nessa fase a personalidade da sociedade fica limitada aos atos de resolução de pendências, e quem a representa é o liquidante, no lugar do administrador. Ela pode ser judicial, quando há desacordo entre os sócios, ou extrajudicial.",
  question: "Quem representa a sociedade durante a fase de liquidação?",
  options: [
    "O administrador, como sempre.",
    "O liquidante.",
    "O sócio mais antigo.",
    "O credor com maior crédito."
  ],
  answer: 1,
  feedback: "O liquidante administra a sociedade em liquidação, representa-a e deve prestar contas. A sociedade só pode praticar atos relativos à liquidação."
},
// 10 - Apuração dos haveres
{
  aula: "Aula 10 - Dissolução de sociedades",
  tipo: "Contextualizada",
  texto: "Na dissolução parcial, a empresa continua, mas o sócio que sai tem direito a receber o valor de sua participação. A apuração dos haveres é o cálculo desse valor. Conforme o Art. 1.031 do Código Civil, a quota é liquidada com base na situação patrimonial da sociedade na data da resolução, verificada em balanço especialmente levantado, e paga em dinheiro em 90 dias, salvo disposição em contrário.",
  question: "Qual é a finalidade da apuração dos haveres na dissolução parcial?",
  options: [
    "Encerrar a sociedade e extinguir sua personalidade jurídica.",
    "Determinar a quantia devida ao sócio que se retira, evitando o enriquecimento ilícito dos demais.",
    "Escolher um novo administrador.",
    "Cancelar as dívidas da sociedade."
  ],
  answer: 1,
  feedback: "Na dissolução parcial o objetivo não é terminar a empresa, e sim pagar ao sócio retirante o que lhe cabe."
},
// ===== AULA 11 =====
// 1 - Falência
{
  aula: "Aula 11 - Falência",
  tipo: "Explicativa",
  texto: "A falência é o instituto do direito empresarial aplicável apenas ao devedor empresário e à sociedade empresária insolventes. É regulada pela Lei nº 11.101/2005. Seu objetivo é afastar o devedor de suas atividades para preservar e otimizar o uso produtivo dos bens, ativos e recursos da empresa, inclusive os intangíveis, e assim evitar que os credores saiam totalmente no prejuízo.",
  question: "Qual alternativa descreve o objetivo da falência?",
  options: [
    "Perdoar todas as dívidas do empresário sem pagar nenhum credor.",
    "Afastar o devedor de suas atividades para preservar e otimizar a utilização produtiva dos bens e ativos.",
    "Proteger apenas os sócios da sociedade.",
    "Impedir a abertura de novas empresas."
  ],
  answer: 1,
  feedback: "A falência também funciona como mecanismo de controle da economia, afastando empresários sem sucesso."
},
// 2 - Princípios
{
  aula: "Aula 11 - Falência",
  tipo: "Explicativa",
  texto: "O direito falimentar é guiado por princípios. O par conditio creditorum determina tratamento igualitário entre os credores. A maximização dos ativos busca obter o maior valor possível dos bens. A celeridade e a economia processual organizam o processo. A vinculação patrimonial compromete todos os bens e direitos do devedor ao pagamento dos credores.",
  question: "Qual princípio determina o tratamento igualitário entre os credores?",
  options: [
    "Maximização dos ativos.",
    "Vinculação patrimonial.",
    "Celeridade e economia processual.",
    "Par conditio creditorum."
  ],
  answer: 3,
  feedback: "Todos os credores devem ter igualdade de condições para receber, respeitada a ordem legal de preferência."
},
// 3 - Falência x recuperação judicial
{
  aula: "Aula 11 - Falência",
  tipo: "Contextualizada",
  texto: "A falência e a recuperação judicial são institutos diferentes. Na falência há o fim da atividade, e o devedor perde o direito de administrar e dispor de seus bens. Na recuperação judicial a atividade continua: o devedor e os administradores são mantidos, mas ficam sob fiscalização do comitê e do administrador judicial, se houver.",
  question: "Uma empresa em crise quer manter as atividades e continuar com seus administradores, sob fiscalização. Qual instituto se encaixa?",
  options: [
    "Falência, pois ela mantém a atividade.",
    "Dissolução total por vontade dos sócios.",
    "Recuperação judicial, que possibilita a continuidade da atividade.",
    "Liquidação extrajudicial."
  ],
  answer: 2,
  feedback: "A falência encerra a atividade e afasta o devedor da administração. A recuperação judicial busca preservar a empresa."
},
// 4 - Quem pode requerer
{
  aula: "Aula 11 - Falência",
  tipo: "Aplicação",
  texto: "Podem requerer a falência do devedor, segundo o Art. 97 da Lei de Recuperação e Falências: o próprio devedor (autofalência), o cônjuge sobrevivente, o herdeiro, o inventariante, o quotista ou acionista e qualquer credor. Neste último caso, se o credor for empresário, deve provar a regularidade de sua atividade.",
  question: "Uma sociedade empresária está insolvente e seus próprios sócios resolvem pedir a falência dela. Como se chama esse pedido?",
  options: [
    "Recuperação extrajudicial.",
    "Autofalência.",
    "Concordata.",
    "Restituição."
  ],
  answer: 1,
  feedback: "Quando o próprio devedor requer a falência, é a autofalência, uma das hipóteses do Art. 97."
},
// 5 - Pressupostos
{
  aula: "Aula 11 - Falência",
  tipo: "Explicativa",
  texto: "Para a falência ser instaurada, são necessários três pressupostos: o devedor ser empresário ou sociedade empresária, estar em situação de insolvência (incapacidade de pagar as dívidas, de caráter jurídico, que se caracteriza por impontualidade injustificada, atos de falência ou execução frustrada) e haver sentença declaratória de falência.",
  question: "Qual conjunto reúne os pressupostos da falência?",
  options: [
    "Devedor empresário, insolvência e sentença declaratória de falência.",
    "Devedor profissional liberal, insolvência e acordo entre os credores.",
    "Sociedade simples, lucro e registro no cartório.",
    "Devedor qualquer, inadimplência e protesto."
  ],
  answer: 0,
  feedback: "Sem qualquer um dos três, não há falência. Só a sentença declaratória a instaura formalmente."
},
// 6 - Quem não se sujeita
{
  aula: "Aula 11 - Falência",
  tipo: "Aplicação",
  texto: "A Lei de Falências não se aplica a todos os devedores. O Art. 2º exclui, entre outros, as empresas públicas, as sociedades de economia mista, as instituições financeiras, as cooperativas de crédito, as seguradoras e as operadoras de planos de saúde. Além disso, só empresários e sociedades empresárias se sujeitam à lei falimentar (Art. 1º).",
  question: "Um banco privado ficou insolvente. A Lei nº 11.101/2005 pode ser aplicada a ele?",
  options: [
    "Sim, pois todo devedor é sujeito à lei falimentar.",
    "Sim, mas apenas se ele for sociedade simples.",
    "Sim, mas só na modalidade de autofalência.",
    "Não, pois instituições financeiras estão excluídas pelo Art. 2º."
  ],
  answer: 3,
  feedback: "Instituições financeiras seguem regime próprio. A lei falimentar também não alcança sociedades simples e profissionais liberais."
},
// 7 - Termo legal e atos ineficazes
{
  aula: "Aula 11 - Falência",
  tipo: "Contextualizada",
  texto: "O termo legal da falência é fixado pelo juiz e não pode retroagir mais de 90 dias contados do pedido de falência, do pedido de recuperação judicial ou do primeiro protesto por falta de pagamento. Alguns atos do devedor nesse período, como pagar dívidas ainda não vencidas ou praticar atos gratuitos até 2 anos antes da decretação, podem ser declarados ineficazes (Arts. 129 e 130).",
  question: "Pouco antes da falência, uma empresa pagou antecipadamente uma dívida que só venceria meses depois, favorecendo um credor. O que isso pode representar?",
  options: [
    "Um ato regular, sempre válido.",
    "Um ato que pode ser declarado ineficaz perante a massa falida.",
    "Um motivo para anular a empresa.",
    "Um crédito extraconcursal automático."
  ],
  answer: 1,
  feedback: "O pagamento de dívidas vincendas dentro do termo legal é um dos atos ineficazes, pois fere a igualdade entre os credores."
},
// 8 - Efeitos da sentença
{
  aula: "Aula 11 - Falência",
  tipo: "Explicativa",
  texto: "A sentença que decreta a falência suspende o curso da prescrição e das ações e execuções contra o devedor. Ela também faz com que o devedor perca o direito de administrar seus bens ou deles dispor e o inabilita para atividades empresariais (Arts. 102 e 103). Os sócios de responsabilidade ilimitada também têm sua falência decretada.",
  question: "Qual é um efeito da sentença que decreta a falência?",
  options: [
    "O devedor passa a administrar livremente seus bens.",
    "As ações contra o devedor ganham velocidade.",
    "O devedor perde o direito de administrar seus bens e deles dispor.",
    "Todos os credores recebem pagamento imediato."
  ],
  answer: 2,
  feedback: "O afastamento do devedor da administração é central para preservar o patrimônio em benefício dos credores."
},
// 9 - Restituição
{
  aula: "Aula 11 - Falência",
  tipo: "Aplicação",
  texto: "Depois da sentença de falência, existe a restituição de bens de terceiros: o proprietário de bens que estavam em poder do devedor na data da decretação pode pedi-los de volta. Também é possível pedir a restituição de coisa vendida a crédito e entregue ao devedor nos 15 dias antes do pedido de falência, ou seu valor em dinheiro, se o bem não existir mais.",
  question: "Uma locadora tinha alugado uma máquina a uma empresa que depois faliu. A máquina continua em poder da falida. O que a locadora pode fazer?",
  options: [
    "Nada, pois a máquina entra na massa falida.",
    "Pedir a restituição do bem, por ser proprietária.",
    "Assumir a administração da empresa falida.",
    "Cobrar apenas como credor quirografário."
  ],
  answer: 1,
  feedback: "Bens de terceiros em poder do devedor não pertencem à massa falida, e o proprietário pode pedir a restituição."
},
// 10 - Ordem de preferência
{
  aula: "Aula 11 - Falência",
  tipo: "Contextualizada",
  texto: "O pagamento dos créditos na falência obedece a uma ordem legal. Primeiro vêm os créditos extraconcursais, que surgem no decorrer da falência. Depois, os créditos trabalhistas (até 150 salários mínimos por credor) e de acidentes de trabalho, seguidos dos créditos com garantia real (até o limite do bem gravado), dos créditos tributários (exceto multas), dos privilégios especial e geral, dos quirografários, das multas e dos créditos subordinados.",
  question: "Segundo a ordem de preferência, qual crédito é pago antes dos créditos com garantia real?",
  options: [
    "Os créditos quirografários.",
    "Os créditos subordinados.",
    "Os créditos trabalhistas, até o limite de 150 salários mínimos por credor.",
    "As multas contratuais."
  ],
  answer: 2,
  feedback: "Os trabalhistas até 150 salários mínimos têm prioridade. O que exceder esse teto passa a ser tratado como crédito quirografário."
},
  ],

  fixacao: [
    // ===== AULA 9 =====
// 1 - Registro simples
{
  aula: "Aula 9 - Sociedades",
  tipo: "Direta",
  texto: "Cada tipo de sociedade se vincula a um órgão de registro diferente.",
  question: "Onde a sociedade simples registra seus atos constitutivos?",
  options: [
    "Na Junta Comercial do estado.",
    "No Registro Público de Empresas Mercantis.",
    "No Registro Civil das Pessoas Jurídicas.",
    "Na Receita Federal, apenas."
  ],
  answer: 2,
  feedback: "A sociedade simples registra-se no Registro Civil das Pessoas Jurídicas. A Junta Comercial atende as sociedades empresárias (Art. 1.150 do CC)."
},
// 2 - Tipos da simples
{
  aula: "Aula 9 - Sociedades",
  tipo: "Direta",
  texto: "A sociedade simples pode adotar alguns tipos previstos no Código Civil, mas existem exceções.",
  question: "Qual tipo societário a sociedade simples NÃO pode adotar?",
  options: [
    "Sociedade limitada.",
    "Sociedade anônima.",
    "Sociedade em nome coletivo.",
    "Sociedade em comandita simples."
  ],
  answer: 1,
  feedback: "A anônima e a comandita por ações são sempre empresárias. A simples pode adotar nome coletivo, comandita simples, limitada ou a forma de simples pura."
},
// 3 - Sociedade em comum
{
  aula: "Aula 9 - Sociedades",
  tipo: "Direta",
  texto: "Algumas sociedades funcionam sem ter levado seus atos ao registro.",
  question: "Por que a sociedade em comum não tem personalidade jurídica?",
  options: [
    "Porque ainda não registrou seus atos constitutivos.",
    "Porque seu capital é dividido em ações.",
    "Porque seus sócios têm responsabilidade limitada.",
    "Porque só possui sócios pessoas jurídicas."
  ],
  answer: 0,
  feedback: "A personalidade jurídica surge com o registro. Sem ele, os sócios respondem de forma solidária e ilimitada (Art. 990 do CC)."
},
// 4 - Nome da LTDA
{
  aula: "Aula 9 - Sociedades",
  tipo: "Direta",
  texto: "O nome empresarial da sociedade limitada tem regras próprias previstas no Código Civil.",
  question: "Como deve terminar o nome empresarial de uma sociedade limitada?",
  options: [
    "Com a expressão sociedade anônima.",
    "Com o termo limitada ou a sigla LTDA.",
    "Com a sigla S/A.",
    "Com a expressão comandita simples."
  ],
  answer: 1,
  feedback: "O nome pode ser firma ou denominação, sempre acrescido de limitada ou LTDA (Art. 1.064 do CC)."
},
// 5 - Alteração de contrato
{
  aula: "Aula 9 - Sociedades",
  tipo: "Contexto",
  texto: "Em uma sociedade simples, nem toda mudança no contrato social precisa do mesmo quórum. Mudar as cláusulas essenciais exige mais do que mudar as demais.",
  question: "Qual alteração do contrato de uma sociedade simples depende do consentimento de todos os sócios?",
  options: [
    "Mudança do endereço da sede.",
    "Mudança da denominação da sociedade.",
    "Mudança do horário de reuniões internas.",
    "Mudança do banco usado pela sociedade."
  ],
  answer: 1,
  feedback: "Capital, quotas, denominação, prazo e participação nos lucros e perdas exigem unanimidade. As demais podem ser decididas por maioria absoluta (Art. 999 do CC)."
},
// 6 - Administração
{
  aula: "Aula 9 - Sociedades",
  tipo: "Contexto",
  texto: "Os sócios de uma sociedade simples podem ser pessoas físicas ou jurídicas, mas a administração tem uma exigência própria.",
  question: "Quem pode exercer a administração de uma sociedade simples?",
  options: [
    "Apenas pessoa física, por ser atividade personalíssima.",
    "Qualquer pessoa jurídica sócia.",
    "Somente o sócio que tiver mais quotas.",
    "Apenas um advogado contratado."
  ],
  answer: 0,
  feedback: "A administração só pode ser exercida por pessoa física, com diligência e cuidado (Art. 1.011 do CC)."
},
// 7 - Quotas na LTDA
{
  aula: "Aula 9 - Sociedades",
  tipo: "Contexto",
  texto: "O capital da sociedade limitada é dividido em quotas, que podem ser iguais ou desiguais entre os sócios.",
  question: "Qual afirmação sobre as quotas da sociedade limitada é correta?",
  options: [
    "É possível criar quotas preferenciais livremente.",
    "As quotas podem ser pagas apenas com serviços.",
    "Não é possível criar quotas preferenciais.",
    "Cada quota só pode pertencer a um único dono."
  ],
  answer: 2,
  feedback: "Na limitada não há quotas preferenciais. As quotas são indivisíveis em relação à sociedade, mas uma quota pode ter mais de um titular."
},
// 8 - Sócio ostensivo
{
  aula: "Aula 9 - Sociedades",
  tipo: "Aplicação",
  texto: "Em uma sociedade em conta de participação, Rui exerce a atividade e se apresenta a terceiros, enquanto Clara apenas investiu capital e permanece oculta. Rui teve sua falência decretada.",
  question: "Qual o efeito da falência de Rui, o sócio ostensivo?",
  options: [
    "Clara passa a responder ilimitadamente.",
    "A falência não afeta a sociedade.",
    "Clara assume automaticamente o lugar de Rui.",
    "A sociedade se dissolve."
  ],
  answer: 3,
  feedback: "A falência do sócio ostensivo leva à dissolução da sociedade. Já a falência do sócio participante é regida pelos contratos."
},
// 9 - Debêntures
{
  aula: "Aula 9 - Sociedades",
  tipo: "Aplicação",
  texto: "Uma companhia precisa captar recursos para ampliar sua fábrica. Em vez de vender novas ações, ela decide tomar emprestado dinheiro do público e emitir títulos que dão ao investidor direito de crédito contra a empresa.",
  question: "Como se chamam esses títulos?",
  options: [
    "Debêntures.",
    "Ações ordinárias.",
    "Partes beneficiárias.",
    "Quotas sociais."
  ],
  answer: 0,
  feedback: "Debêntures representam empréstimo feito pela companhia junto a terceiros (Art. 52 da LSA). Ações dividem o capital social."
},
// 10 - Diretor destituído
{
  aula: "Aula 9 - Sociedades",
  tipo: "Aplicação",
  texto: "Em uma comandita por ações, o diretor Paulo é destituído pelos sócios, com o quórum exigido. Meses depois, aparece uma dívida contraída durante a gestão dele.",
  question: "Qual a situação de Paulo em relação a essa dívida?",
  options: [
    "Fica livre de qualquer responsabilidade.",
    "Responde apenas se tiver agido com dolo.",
    "Responde somente se voltar ao cargo.",
    "Continua responsável por mais 2 anos pelas obrigações da sua gestão."
  ],
  answer: 3,
  feedback: "O diretor destituído continua responsável pelas obrigações contraídas na sua administração por 2 anos (Art. 1.091 do CC e Art. 282 da LSA)."
},
// ===== AULA 10 =====
// 1 - Liquidação
{
  aula: "Aula 10 - Dissolução de sociedades",
  tipo: "Direta",
  texto: "Depois do fato que provoca o fim da sociedade, vem uma fase voltada aos débitos.",
  question: "Qual é a função da liquidação?",
  options: [
    "Escolher os novos sócios.",
    "Levantar o patrimônio e pagar as dívidas antes da partilha.",
    "Registrar uma nova sociedade.",
    "Dividir o lucro entre os sócios."
  ],
  answer: 1,
  feedback: "A liquidação apura o ativo e quita o passivo. Só depois o que sobrar é dividido entre os sócios, na partilha."
},
// 2 - Aviso de retirada
{
  aula: "Aula 10 - Dissolução de sociedades",
  tipo: "Direta",
  texto: "Nas sociedades por prazo indeterminado, o sócio tem liberdade para sair.",
  question: "Com qual antecedência o sócio deve comunicar sua retirada aos demais?",
  options: [
    "15 dias.",
    "30 dias.",
    "60 dias.",
    "180 dias."
  ],
  answer: 2,
  feedback: "O aviso de 60 dias permite que os demais se preparem para a alteração contratual."
},
// 3 - Prazo da unipessoalidade
{
  aula: "Aula 10 - Dissolução de sociedades",
  tipo: "Direta",
  texto: "Uma sociedade contratual precisa, em regra, de mais de um sócio.",
  question: "Qual é o prazo para recompor a pluralidade de sócios, segundo o Código Civil?",
  options: [
    "30 dias.",
    "90 dias.",
    "120 dias.",
    "180 dias."
  ],
  answer: 3,
  feedback: "O Art. 1.033, inciso IV, concede 180 dias. Esgotado o prazo, a sociedade é dissolvida."
},
// 4 - Pagamento dos haveres
{
  aula: "Aula 10 - Dissolução de sociedades",
  tipo: "Direta",
  texto: "Quando um sócio sai e a empresa continua, ele precisa receber o valor da sua participação.",
  question: "Em qual prazo a quota liquidada é paga, salvo estipulação em contrário?",
  options: [
    "Em 90 dias.",
    "Em 30 dias.",
    "Em 60 dias.",
    "Em 120 dias."
  ],
  answer: 0,
  feedback: "Pelo Art. 1.031, a quota liquidada é paga em dinheiro em 90 dias a partir da liquidação, com base em balanço especial."
},
// 5 - Exclusão de sócio remisso
{
  aula: "Aula 10 - Dissolução de sociedades",
  tipo: "Contexto",
  texto: "Um dos sócios se comprometeu a integralizar sua parte do capital em um prazo combinado e não cumpriu.",
  question: "O que os demais sócios podem fazer, segundo a aula?",
  options: [
    "Dissolver a sociedade sem qualquer outra causa.",
    "Cobrar dele apenas multa, sem excluí-lo.",
    "Excluí-lo, inclusive de forma extrajudicial.",
    "Nada, pois a lei veda qualquer exclusão."
  ],
  answer: 2,
  feedback: "A falta de integralização é causa legal de exclusão, que pode ser extrajudicial quando todos os demais a decidem."
},
// 6 - Dissolução por vontade na LTDA
{
  aula: "Aula 10 - Dissolução de sociedades",
  tipo: "Contexto",
  texto: "Os sócios de uma sociedade limitada decidem, em assembleia, encerrar as atividades antes do prazo previsto no contrato.",
  question: "Qual é o quórum de concordância exigido na limitada, segundo a aula?",
  options: [
    "Metade do capital social.",
    "Três quartos do capital social.",
    "Um quinto do capital social.",
    "Apenas a maioria dos presentes."
  ],
  answer: 1,
  feedback: "Na limitada, a dissolução por vontade dos sócios exige três quartos. Na S/A ela é tratada em assembleia geral extraordinária."
},
// 7 - Liquidante
{
  aula: "Aula 10 - Dissolução de sociedades",
  tipo: "Contexto",
  texto: "Durante a liquidação, a sociedade só pode praticar atos ligados à resolução das pendências com credores.",
  question: "Quem passa a representar a sociedade nessa fase?",
  options: [
    "O contador.",
    "O sócio majoritário.",
    "O antigo administrador.",
    "O liquidante."
  ],
  answer: 3,
  feedback: "O liquidante substitui o administrador, representa a sociedade em liquidação, presta contas e responde de forma análoga aos administradores."
},
// 8 - Sócio falido
{
  aula: "Aula 10 - Dissolução de sociedades",
  tipo: "Aplicação",
  texto: "Em uma sociedade com vários sócios, um deles tem a falência pessoal decretada. Os demais querem manter a empresa funcionando.",
  question: "O que o parágrafo único do Art. 1.030 do Código Civil prevê para esse sócio?",
  options: [
    "É excluído de pleno direito da sociedade.",
    "Deve assumir a administração.",
    "Passa a ter direito a duas quotas.",
    "Fica isento de qualquer obrigação."
  ],
  answer: 0,
  feedback: "O sócio falido é excluído de pleno direito, o que gera dissolução parcial e permite a continuidade da empresa."
},
// 9 - Prazo determinado
{
  aula: "Aula 10 - Dissolução de sociedades",
  tipo: "Aplicação",
  texto: "Júlia faz parte de uma sociedade criada para durar 10 anos. Após 3 anos, ela quer sair, sem que os demais tenham dado motivo.",
  question: "O que Júlia precisa fazer para se retirar antes do fim do prazo?",
  options: [
    "Avisar os demais com 30 dias de antecedência.",
    "Comprovar justa causa em juízo.",
    "Apenas deixar de comparecer às reuniões.",
    "Pedir a falência da sociedade."
  ],
  answer: 1,
  feedback: "Em sociedade por prazo determinado, a retirada antecipada exige justa causa comprovada judicialmente."
},
// 10 - Anulação do registro
{
  aula: "Aula 10 - Dissolução de sociedades",
  tipo: "Aplicação",
  texto: "Uma sentença judicial anula a constituição de uma sociedade por vício na formação, e seus registros perdem validade.",
  question: "Qual é o efeito dessa sentença, segundo a doutrina citada?",
  options: [
    "Apenas a troca do administrador.",
    "A saída automática de um único sócio.",
    "A suspensão das dívidas por um ano.",
    "Funciona como ato de dissolução, seguido de liquidação."
  ],
  answer: 3,
  feedback: "A sentença que anula ou declara a nulidade tem efeito de dissolução, e a execução é a liquidação, com a extinção da personalidade jurídica."
},
// ===== AULA 11 =====
// 1 - Lei de falências
{
  aula: "Aula 11 - Falência",
  tipo: "Direta",
  texto: "A falência no Brasil é regulada por lei específica.",
  question: "Qual lei regula a falência e a recuperação de empresas?",
  options: [
    "Lei nº 11.101/2005.",
    "Lei nº 6.404/1976.",
    "Lei nº 8.078/1990.",
    "Lei nº 9.099/1995."
  ],
  answer: 0,
  feedback: "A Lei nº 11.101/2005 é a Lei de Recuperação e Falências. A Lei nº 6.404/1976 trata das sociedades anônimas."
},
// 2 - Par conditio creditorum
{
  aula: "Aula 11 - Falência",
  tipo: "Direta",
  texto: "O direito falimentar é guiado por princípios que orientam as decisões do processo.",
  question: "O que estabelece o princípio par conditio creditorum?",
  options: [
    "Os maiores credores recebem primeiro.",
    "O devedor escolhe a quem pagar.",
    "Apenas credores de boa-fé recebem.",
    "Há tratamento igualitário entre os credores."
  ],
  answer: 3,
  feedback: "Todos os credores devem ter igualdade de condições para receber, respeitada a ordem legal de preferência."
},
// 3 - Recurso
{
  aula: "Aula 11 - Falência",
  tipo: "Direta",
  texto: "A decisão que decreta a falência e a que julga improcedente o pedido têm recursos diferentes.",
  question: "Qual recurso cabe contra a decisão que decreta a falência?",
  options: [
    "Apelação.",
    "Embargos de declaração, apenas.",
    "Agravo de instrumento.",
    "Recurso ordinário."
  ],
  answer: 2,
  feedback: "Da decisão que decreta a falência cabe agravo de instrumento. Da sentença que julga improcedente o pedido cabe apelação."
},
// 4 - Termo legal
{
  aula: "Aula 11 - Falência",
  tipo: "Direta",
  texto: "O juiz fixa o termo legal da falência, que define até onde atos do devedor podem ser questionados.",
  question: "Qual é o período máximo do termo legal, contado do pedido de falência ou de recuperação judicial?",
  options: [
    "30 dias.",
    "60 dias.",
    "90 dias.",
    "120 dias."
  ],
  answer: 2,
  feedback: "O termo legal não pode retroagir mais de 90 dias. Atos praticados nesse período podem ser considerados ineficazes."
},
// 5 - Juízo universal
{
  aula: "Aula 11 - Falência",
  tipo: "Contexto",
  texto: "O juízo falimentar é, em regra, universal e indivisível: concentra as ações sobre bens, interesses e negócios da massa falida. Mesmo assim, há exceções.",
  question: "Qual tipo de ação NÃO é julgado pelo juízo falimentar?",
  options: [
    "Habilitação de crédito quirografário.",
    "Ação de restituição de bem.",
    "Ação de cobrança de multa contratual.",
    "Reclamação trabalhista."
  ],
  answer: 3,
  feedback: "As causas trabalhistas e as fiscais ficam fora do juízo falimentar, assim como as ações em que o falido é autor, entre outras."
},
// 6 - Ministério Público
{
  aula: "Aula 11 - Falência",
  tipo: "Contexto",
  texto: "Na administração da falência atuam vários agentes, cada um com seu papel: o juiz conduz o processo, e há órgãos como o administrador judicial e o comitê de credores.",
  question: "Qual a função do Ministério Público no processo falimentar?",
  options: [
    "Administrar os bens da massa.",
    "Atuar como fiscal da lei.",
    "Votar nas decisões dos credores.",
    "Decidir o termo legal."
  ],
  answer: 1,
  feedback: "O Ministério Público é fiscal da lei. A condução do processo cabe ao juiz, e a administração, ao administrador judicial."
},
// 7 - Insolvência
{
  aula: "Aula 11 - Falência",
  tipo: "Contexto",
  texto: "A insolvência é a incapacidade de pagar as dívidas e tem caráter jurídico. Para configurá-la, a lei exige hipóteses específicas, e não basta a empresa estar com dificuldades.",
  question: "Qual alternativa indica um requisito de caracterização da insolvência?",
  options: [
    "Possuir mais de um sócio.",
    "Ter sede no exterior.",
    "Execução frustrada.",
    "Ser sociedade anônima."
  ],
  answer: 2,
  feedback: "A insolvência se caracteriza por impontualidade injustificada, atos de falência ou execução frustrada."
},
// 8 - Ato gratuito
{
  aula: "Aula 11 - Falência",
  tipo: "Aplicação",
  texto: "Dezoito meses antes de ter a falência decretada, uma empresa doou um imóvel a um parente do sócio, sem receber nada em troca.",
  question: "Como a lei trata esse ato em relação à massa falida?",
  options: [
    "Como ato válido, pois ocorreu antes da falência.",
    "Como crédito extraconcursal.",
    "Como ato ineficaz, por ser gratuito e praticado até 2 anos antes.",
    "Como obrigação dos credores."
  ],
  answer: 2,
  feedback: "Atos gratuitos praticados até 2 anos antes da decretação são ineficazes em relação à massa falida (Arts. 129 e 130 da LRE)."
},
// 9 - Crédito trabalhista acima do teto
{
  aula: "Aula 11 - Falência",
  tipo: "Aplicação",
  texto: "Em uma falência, um empregado tem crédito trabalhista de valor muito alto, bem acima do limite de 150 salários mínimos por credor.",
  question: "Como é tratada a parte que ultrapassa esse limite?",
  options: [
    "É classificada como crédito quirografário.",
    "Recebe prioridade absoluta.",
    "É perdoada.",
    "É paga antes dos créditos extraconcursais."
  ],
  answer: 0,
  feedback: "Até 150 salários mínimos, o crédito trabalhista tem preferência. O excedente entra na classe dos quirografários."
},
// 10 - Encerramento
{
  aula: "Aula 11 - Falência",
  tipo: "Aplicação",
  texto: "Concluída a venda dos ativos e o pagamento dos credores, o administrador judicial apresenta seu relatório final e o juiz encerra a falência por sentença.",
  question: "Qual efeito ocorre a partir do trânsito em julgado dessa sentença?",
  options: [
    "O prazo prescricional das obrigações do falido volta a correr.",
    "As obrigações do falido são renovadas.",
    "Os credores perdem todas as ações.",
    "O falido recupera a condição de empresário automaticamente."
  ],
  answer: 0,
  feedback: "O prazo prescricional das obrigações do falido recomeça a correr no dia em que transita em julgado a sentença de encerramento."
},
  ],

  enade: [
    // ===== AULA 9 =====
// 1 - Registro da sociedade
{
  aula: "Aula 9 - Sociedades",
  tipo: "Conceitual Contextualizada",
  texto: "O Código Civil classifica as sociedades em simples e empresárias conforme o objeto. Considera-se empresária a sociedade que exerce atividade própria de empresário sujeito a registro, e simples, as demais (Art. 982). O registro das empresárias é feito na Junta Comercial, e o das simples, no Registro Civil das Pessoas Jurídicas (Art. 1.150). Rafael e Lúcia constituíram uma sociedade para fabricar e vender móveis planejados em escala industrial, com compra de matéria-prima e contratação de vários funcionários. Acreditando que bastava um registro qualquer, protocolaram o contrato social no cartório de registro civil.",
  question: "Considerando a classificação do Código Civil e as regras de registro, assinale a alternativa correta.",
  options: [
    "É sociedade empresária, pois a atividade é própria de empresário, e seus atos devem ser registrados na Junta Comercial.",
    "A sociedade é simples, pois apenas atividades de natureza intelectual se registram na Junta Comercial.",
    "O Registro Civil das Pessoas Jurídicas é o órgão geral de registro, e vale para qualquer tipo de sociedade.",
    "Como a sociedade tem poucos sócios, ela pode escolher livremente entre a Junta Comercial e o cartório."
  ],
  answer: 0,
  feedback: "A fabricação e a venda em escala industrial são atividade própria de empresário, e por isso a sociedade é **empresária**, com registro na ==def==Junta Comercial==. O Registro Civil das Pessoas Jurídicas é reservado, em regra, às sociedades simples."
},
// 2 - Sociedade em comum
{
  aula: "Aula 9 - Sociedades",
  tipo: "Análise Aplicada",
  texto: "A sociedade em comum é aquela que ainda não registrou seus atos constitutivos e, por isso, não tem personalidade jurídica. Seus bens e dívidas formam um patrimônio especial, e todos os sócios respondem solidária e ilimitadamente pelas obrigações sociais, sendo excluído do benefício de ordem aquele que contratou pela sociedade (Art. 990). Três amigos abriram um restaurante sem registrar o contrato social. Pedro, um dos sócios, comprou insumos de um fornecedor em nome do negócio, mas a dívida não foi paga. O fornecedor quer cobrar o valor.",
  question: "Com base nas regras da sociedade em comum, assinale a alternativa correta.",
  options: [
    "Somente Pedro responde pela dívida, pois foi o único sócio a contratar com o fornecedor.",
    "A sociedade já tem personalidade jurídica desde o acordo verbal, e os sócios respondem apenas até o valor de suas quotas.",
    "Todos os sócios respondem solidária e ilimitadamente, e Pedro, que contratou, não pode invocar o benefício de ordem.",
    "O fornecedor não pode cobrar a dívida, pois uma sociedade sem registro não tem capacidade processual em nenhum dos polos."
  ],
  answer: 2,
  feedback: "Sem registro não há personalidade jurídica. Todos os sócios respondem **solidária e ilimitadamente**, e quem contratou pela sociedade perde o ==rule==benefício de ordem==, isto é, não pode exigir que os bens da sociedade sejam executados primeiro."
},
// 3 - Conta de participação
{
  aula: "Aula 9 - Sociedades",
  tipo: "Análise Aplicada",
  texto: "A sociedade em conta de participação é tratada como um contrato especial de investimento, sem personalidade jurídica, patrimônio próprio nem nome empresarial. O contrato produz efeitos somente entre os sócios, e sua inscrição em qualquer registro não confere personalidade jurídica (Art. 993). Há dois tipos de sócio: o ostensivo, que exerce a atividade e opera frente a terceiros com responsabilidade ilimitada, e o participante, que apenas fornece capital e permanece oculto. Helena investiu dinheiro no negócio de Bruno por meio de uma conta de participação. O empreendimento deu prejuízo, e credores de Bruno querem cobrar também de Helena.",
  question: "Considerando a natureza da conta de participação, assinale a alternativa correta.",
  options: [
    "Helena responde ilimitadamente perante os credores, pois todo sócio responde pelas dívidas da atividade.",
    "Helena, sócia participante, responde apenas perante Bruno, o sócio ostensivo, que é quem opera frente aos terceiros.",
    "Se o contrato for inscrito em algum registro, a sociedade adquire personalidade jurídica e os credores poderão cobrar de Helena.",
    "A conta de participação tem patrimônio e nome empresarial próprios, e Helena responde com eles."
  ],
  answer: 1,
  feedback: "O **sócio participante** é oculto e responde somente perante o sócio ostensivo. A inscrição do contrato em registro não cria personalidade jurídica, e a conta de participação não tem patrimônio nem nome empresarial."
},
// 4 - Limitada: contribuição em serviços
{
  aula: "Aula 9 - Sociedades",
  tipo: "Análise Aplicada",
  texto: "Na sociedade limitada, o capital é dividido em quotas, e a responsabilidade dos sócios é, em regra, limitada ao valor de suas quotas, respondendo todos solidariamente pela integralização do capital. A lei veda a contribuição de sócio em serviços para a formação do capital (Art. 1.055). Mariana e Tiago estão constituindo uma sociedade limitada. Mariana integralizará sua quota em dinheiro. Tiago, sem recursos no momento, propõe integralizar a sua quota com o compromisso de prestar serviços de gestão durante cinco anos.",
  question: "Segundo as regras da sociedade limitada, assinale a alternativa correta sobre a proposta de Tiago.",
  options: [
    "É válida, pois todos os tipos societários admitem a contribuição em serviços.",
    "É válida, mas Tiago passará a responder ilimitadamente pelas dívidas da sociedade.",
    "Só é válida se aprovada por três quartos do capital social.",
    "Não é válida, pois a limitada veda a contribuição em serviços."
  ],
  answer: 3,
  feedback: "A contribuição em **serviços** é permitida na sociedade simples, mas vedada na ==rule==limitada== e na sociedade anônima. Na limitada, o capital é formado por dinheiro ou bens passíveis de avaliação."
},
// 5 - Cessão de quotas
{
  aula: "Aula 9 - Sociedades",
  tipo: "Análise Aplicada",
  texto: "Na sociedade limitada, a cessão de quotas segue o que o contrato social estabelecer. Se o contrato for omisso, a cessão a outro sócio independe da concordância dos demais, e a cessão a quem não é sócio pode ser feita desde que não haja oposição de titulares de mais de um quarto do capital social (Art. 1.057). Em uma sociedade limitada com contrato omisso sobre o assunto, Roberto (30% do capital) quer vender suas quotas a um estranho. Silvia (20%) se opõe à venda. Davi (50%) não se opõe.",
  question: "Considerando as regras de cessão de quotas, assinale a alternativa correta.",
  options: [
    "A cessão é inválida, pois qualquer sócio pode vetar a entrada de um estranho.",
    "A cessão exige o consentimento unânime dos demais sócios.",
    "A cessão é válida, pois Silvia, com 20%, não alcança mais de 1/4 do capital.",
    "A cessão só seria possível se Roberto oferecesse antes as quotas a Davi, e este recusasse."
  ],
  answer: 2,
  feedback: "Para barrar a cessão a estranho, os opositores precisam ter **mais de 1/4 do capital**. Silvia tem 20% e, sozinha, não atinge esse percentual. Se o contrato fosse silente, a cessão a outro sócio seria livre."
},
// 6 - S/A: responsabilidade do acionista
{
  aula: "Aula 9 - Sociedades",
  tipo: "Conceitual Contextualizada",
  texto: "A sociedade anônima é uma sociedade de capital, regida por estatuto e pela Lei nº 6.404/76, com capital dividido em ações. A responsabilidade do acionista é limitada ao preço de emissão das ações que subscreveu ou adquiriu, ou seja, ao valor ainda não integralizado. Carlos subscreveu 1.000 ações de uma sociedade anônima e integralizou apenas 40% do preço de emissão. A companhia entrou em grave crise, e credores passaram a cobrar suas dívidas.",
  question: "Considerando o regime de responsabilidade na sociedade anônima, assinale a alternativa correta.",
  options: [
    "Carlos responde só pelo valor das ações que ainda não integralizou, e não pelas outras dívidas.",
    "Carlos responde ilimitadamente, de forma subsidiária, por todas as dívidas da companhia.",
    "Carlos não responde por nada, ainda que tenha deixado de integralizar parte do preço das ações.",
    "Carlos responde solidariamente com todos os acionistas pela totalidade das dívidas sociais."
  ],
  answer: 0,
  feedback: "Na S/A, a responsabilidade é **limitada ao preço de emissão** das ações. Como Carlos pagou 40%, ele deve integralizar os 60% restantes, mas seu patrimônio pessoal não responde pelas outras dívidas da ==def==companhia==."
},
// 7 - S/A: responsabilidade de administradores
{
  aula: "Aula 9 - Sociedades",
  tipo: "Análise Aplicada",
  texto: "Os administradores de uma sociedade anônima não respondem pessoalmente pelas obrigações que contraírem em nome da companhia em ato regular de gestão. Respondem civilmente pelos prejuízos quando agirem com dolo ou culpa, ou com violação da lei ou do estatuto. Não respondem por atos ilícitos de outros administradores, salvo se forem coniventes com eles, negligenciarem em descobri-los ou deixarem de agir para impedi-los. O diretor financeiro Paulo aprovou uma operação que violava expressamente o estatuto da companhia, causando prejuízo. A diretora Lúcia não participou da decisão e não tinha conhecimento da operação.",
  question: "Com base nas regras de responsabilidade dos administradores, assinale a alternativa correta.",
  options: [
    "Paulo e Lúcia respondem solidariamente, pois a diretoria é um órgão colegiado.",
    "Nenhum dos dois responde, pois atos de gestão nunca geram responsabilidade pessoal.",
    "Somente a companhia responde, e os administradores têm imunidade em qualquer caso.",
    "Paulo responde por violar o estatuto, e Lúcia só se fosse conivente ou omissa."
  ],
  answer: 3,
  feedback: "Quem viola o **estatuto** ou a lei responde pelos prejuízos. A responsabilidade por ato de outro administrador exige ==warn==conivência==, negligência em descobrir ou omissão em impedir, e nenhuma delas foi descrita para Lúcia."
},
// 8 - Ação de responsabilidade contra administrador
{
  aula: "Aula 9 - Sociedades",
  tipo: "Análise Aplicada",
  texto: "Cabe à companhia, mediante deliberação da assembleia, promover a ação de responsabilidade contra o administrador. Se a assembleia decidir não promovê-la, acionistas que representem no mínimo 5% do capital social podem fazê-lo. Se, passados três meses da deliberação, ninguém propuser a ação, qualquer acionista poderá fazê-lo. Um grupo de acionistas que representa 6% do capital quer processar um diretor por prejuízos que ele teria causado. A assembleia geral, porém, votou contra a propositura da ação.",
  question: "Considerando a legitimidade para a ação de responsabilidade, assinale a alternativa correta.",
  options: [
    "Só a companhia pode propor a ação, e a decisão da assembleia é definitiva.",
    "Acionistas com ao menos 5% do capital podem propor a ação, mesmo após a recusa da assembleia.",
    "Qualquer acionista, com qualquer percentual, pode propor a ação imediatamente, sem esperar a assembleia.",
    "Somente o conselho fiscal pode propor a ação quando a assembleia se recusa a fazê-lo."
  ],
  answer: 1,
  feedback: "A regra é que a ação parte da companhia. Havendo recusa da assembleia, a legitimidade passa aos acionistas com **5% do capital**, e, se nada for feito em três meses, a qualquer acionista."
},
// 9 - Comandita por ações
{
  aula: "Aula 9 - Sociedades",
  tipo: "Análise Aplicada",
  texto: "A sociedade em comandita por ações tem natureza híbrida e capital dividido em ações. Somente sócios podem administrá-la, e os diretores respondem de forma ilimitada, solidária e subsidiária. Eles são nomeados no ato constitutivo, e sua destituição exige o voto de no mínimo dois terços do capital social. O diretor destituído continua responsável, por dois anos, pelas obrigações sociais contraídas durante a sua administração (Art. 1.091 do Código Civil). Renato foi destituído do cargo de diretor de uma comandita por ações por votação de dois terços do capital. Seis meses depois, um credor cobrou dívida contraída durante a gestão dele.",
  question: "Segundo as regras da comandita por ações, assinale a alternativa correta.",
  options: [
    "Renato continua responsável, pois o diretor destituído responde por dois anos pelas obrigações de sua gestão.",
    "Com a destituição, Renato deixa imediatamente de responder por qualquer obrigação da sociedade.",
    "Renato responde apenas até o valor das ações que possui, como qualquer acionista.",
    "Somente os sócios comanditários respondem pelas dívidas, pois os diretores são apenas gestores."
  ],
  answer: 0,
  feedback: "A responsabilidade do diretor (**comanditado**) é ilimitada, solidária e subsidiária, e sobrevive à destituição por ==rule==dois anos== quanto às obrigações contraídas na sua gestão."
},
// 10 - Alteração do contrato da sociedade simples
{
  aula: "Aula 9 - Sociedades",
  tipo: "Análise Aplicada",
  texto: "Na sociedade simples, as alterações do contrato social que tratem de matérias essenciais, como capital social, quota de cada sócio, denominação, prazo, participação nos lucros e perdas, dependem do consentimento de todos os sócios. As demais podem ser decididas por maioria absoluta, se o contrato não exigir deliberação unânime (Art. 999). Em uma sociedade simples com cinco sócios, quatro deles aprovaram o aumento do capital social. O quinto sócio votou contra. Os quatro sustentam que a decisão é válida por ter sido tomada pela maioria.",
  question: "Considerando as regras de alteração do contrato da sociedade simples, assinale a alternativa correta.",
  options: [
    "A alteração é válida, pois a maioria absoluta dos sócios é suficiente para qualquer modificação.",
    "A alteração é válida se tiver sido aprovada por dois terços dos sócios.",
    "Não é válida, pois alterar o capital social exige consentimento de todos.",
    "A alteração é válida, desde que o sócio dissidente seja excluído da sociedade."
  ],
  answer: 2,
  feedback: "Alterar o **capital social** é matéria que exige **unanimidade** na sociedade simples. A maioria absoluta só basta para os demais assuntos, quando o contrato não pedir deliberação unânime."
},
// ===== AULA 10 =====
// 1 - Dissolução parcial por morte
{
  aula: "Aula 10 - Dissolução de sociedades",
  tipo: "Conceitual Contextualizada",
  texto: "A dissolução parcial atinge apenas um ou alguns sócios, como nos casos de morte, retirada, exclusão e falência de sócio, e a sociedade continua em funcionamento, pois prevalece a preservação da empresa. Já a dissolução total extingue a personalidade jurídica da sociedade. Na morte de sócio, os herdeiros podem ingressar na sociedade, mas só com a concordância dos demais sócios. Na Alfa Ltda., o sócio Ricardo faleceu. Nenhum dos herdeiros quis ocupar o lugar dele, e os demais sócios decidiram dar continuidade à atividade.",
  question: "Com base na distinção entre dissolução parcial e total, assinale a alternativa correta sobre a situação da Alfa Ltda.",
  options: [
    "Ocorre dissolução total, pois a morte de qualquer sócio extingue a personalidade jurídica da sociedade.",
    "Ocorre dissolução parcial, pois a sociedade continua e a participação de Ricardo deve ser apurada.",
    "Ocorre dissolução total, pois a sociedade passa a ter um sócio a menos e deve ser extinta de imediato.",
    "Não ocorre dissolução de nenhum tipo, pois os herdeiros assumem automaticamente a condição de sócios."
  ],
  answer: 1,
  feedback: "A morte de sócio é causa de **dissolução parcial**. Como os herdeiros não quiseram ingressar, a quota de Ricardo é liquidada, e a sociedade segue em atividade. Os herdeiros só poderiam entrar com a ==rule==concordância dos demais== sócios."
},
// 2 - Retirada em prazo determinado
{
  aula: "Aula 10 - Dissolução de sociedades",
  tipo: "Análise Aplicada",
  texto: "Nas sociedades por prazo indeterminado, o sócio pode se retirar a qualquer tempo, bastando comunicar os demais com 60 dias de antecedência, para que tenham tempo de promover a alteração contratual. Nas sociedades por prazo determinado, o sócio que quiser sair antes do término precisa comprovar justa causa em juízo. Beatriz é sócia de uma sociedade constituída por dez anos. No terceiro ano, sem nenhum motivo específico, ela notificou os demais sócios, com 60 dias de antecedência, de que deseja se retirar.",
  question: "Considerando as regras de retirada de sócio, assinale a alternativa correta.",
  options: [
    "Beatriz pode se retirar livremente, pois basta a comunicação com 60 dias de antecedência.",
    "Beatriz só pode se retirar se houver unanimidade dos demais sócios, mesmo sem justa causa.",
    "Beatriz não pode se retirar em nenhuma hipótese antes de findos os dez anos.",
    "Como o prazo é determinado, Beatriz precisaria comprovar justa causa em juízo antes do término."
  ],
  answer: 3,
  feedback: "A comunicação com **60 dias** vale para sociedades de prazo indeterminado. Em sociedade de ==def==prazo determinado==, a saída antecipada exige a comprovação de justa causa em juízo."
},
// 3 - Exclusão de sócio
{
  aula: "Aula 10 - Dissolução de sociedades",
  tipo: "Análise Aplicada",
  texto: "O sócio que não cumpre a obrigação de integralizar sua quota no prazo acordado pode ser excluído pelos demais, o que configura dissolução parcial e pode ocorrer de forma extrajudicial. A exclusão exige uma causa prevista em lei. Ela não pode ocorrer pela mera vontade dos demais sócios, sem motivo que a justifique. Gustavo prometeu integralizar sua quota em um prazo combinado com os outros sócios, mas não o fez. Os demais sócios, reunidos, decidiram excluí-lo. Em outra sociedade, os sócios querem excluir um colega apenas porque não simpatizam com ele.",
  question: "Considerando as regras de exclusão de sócio, assinale a alternativa correta.",
  options: [
    "Só a de Gustavo é possível, pois ele descumpriu a obrigação de integralizar.",
    "As duas exclusões dependem sempre de ação judicial, independentemente do motivo.",
    "As duas exclusões são válidas, pois os sócios podem excluir qualquer colega por mera vontade.",
    "Nenhuma das duas é possível, pois o sócio inadimplente responde apenas com seu patrimônio pessoal."
  ],
  answer: 0,
  feedback: "A exclusão exige uma ==rule==causa prevista em lei==, como o descumprimento da obrigação de integralizar. A **mera vontade** dos demais sócios, sem motivação legal, não autoriza excluir ninguém."
},
// 4 - Credor particular do sócio
{
  aula: "Aula 10 - Dissolução de sociedades",
  tipo: "Conceitual Contextualizada",
  texto: "O credor particular de um sócio pode, quando faltarem outros bens do devedor, buscar satisfazer seu crédito sobre a participação dele na sociedade. Se a sociedade não estiver dissolvida, o credor pode requerer a liquidação da quota do devedor. O valor, apurado na forma do Art. 1.031 do Código Civil, será depositado em dinheiro no juízo da execução até 90 dias após a liquidação (Art. 1.026). Fábio é sócio de uma sociedade e deve uma quantia a um banco. Ele não tem outros bens suficientes, e o banco quer receber o que for possível.",
  question: "Considerando as regras sobre credor particular de sócio, assinale a alternativa correta.",
  options: [
    "O banco pode penhorar diretamente os bens da sociedade para pagar a dívida pessoal de Fábio.",
    "O banco se torna sócio da sociedade no lugar de Fábio.",
    "O banco pode requerer a liquidação da quota, com depósito em juízo em 90 dias.",
    "A quota de Fábio só pode ser liquidada se a sociedade for totalmente dissolvida."
  ],
  answer: 2,
  feedback: "A sociedade tem personalidade própria, e seus bens não respondem pela dívida pessoal do sócio. O credor pode pedir a **liquidação da quota**, medida que provoca dissolução parcial, com depósito em juízo em até ==def==90 dias==."
},
// 5 - Falência de sócio
{
  aula: "Aula 10 - Dissolução de sociedades",
  tipo: "Análise Aplicada",
  texto: "Segundo o Art. 1.030 do Código Civil, é excluído de pleno direito da sociedade o sócio declarado falido, ou aquele cuja quota tenha sido liquidada a pedido de credor particular. Essa exclusão caracteriza dissolução parcial, e é seguida da apuração dos haveres, com a determinação do valor da participação do sócio. Marcos, sócio de uma sociedade com outros três sócios, teve sua falência declarada. Os demais sócios discutem se precisam votar a exclusão dele ou se a sociedade deve ser encerrada por causa da falência de Marcos.",
  question: "Com base no Art. 1.030 do Código Civil, assinale a alternativa correta.",
  options: [
    "Marcos só poderá ser excluído se houver votação unânime dos demais sócios.",
    "Marcos é excluído de pleno direito, com dissolução parcial e apuração dos haveres.",
    "A falência de um sócio provoca a dissolução total, e a sociedade deve ser encerrada.",
    "A falência de Marcos apenas suspende seus direitos, e ele permanece sócio normalmente."
  ],
  answer: 1,
  feedback: "A falência do sócio é causa de **dissolução parcial**: ele é excluído de pleno direito, não precisa de votação, e a sociedade continua. A ==proc==apuração dos haveres== determina o valor a que ele tem direito."
},
// 6 - Unipessoalidade
{
  aula: "Aula 10 - Dissolução de sociedades",
  tipo: "Análise Aplicada",
  texto: "Dissolve-se a sociedade quando falta a pluralidade de sócios e ela não é reconstituída no prazo de cento e oitenta dias (Art. 1.033, IV, do Código Civil). Após esse prazo, a sociedade entra em fase de liquidação. Uma sociedade simples tinha dois sócios. Um deles se retirou, e a sociedade passou a ter um único sócio. Três meses depois, o sócio remanescente ainda não havia admitido nenhum novo sócio e perguntou ao advogado se a sociedade já estaria dissolvida.",
  question: "Considerando a regra de pluralidade de sócios, assinale a alternativa correta.",
  options: [
    "A sociedade se dissolveu no momento em que o sócio se retirou, e já está em liquidação.",
    "A sociedade pode permanecer indefinidamente com um único sócio, sem qualquer providência.",
    "O prazo de reconstituição é de 90 dias, que já se esgotou.",
    "Ainda há prazo: são 180 dias para recompor a pluralidade e evitar a dissolução."
  ],
  answer: 3,
  feedback: "A lei garante **180 dias** para reconstituir a pluralidade. Passado o prazo sem novo sócio, ocorre a ==def==unipessoalidade== como causa de dissolução, e a sociedade entra em liquidação."
},
// 7 - Liquidante
{
  aula: "Aula 10 - Dissolução de sociedades",
  tipo: "Análise Aplicada",
  texto: "Na fase de liquidação, que vem depois da dissolução, a personalidade da sociedade fica limitada aos atos relativos à resolução das pendências obrigacionais. O administrador deixa de ser o responsável por manifestar a vontade da sociedade, e essa função passa ao liquidante, que a representa judicial e extrajudicialmente, com deveres semelhantes aos do administrador e obrigação de prestar contas. A sociedade Beta foi dissolvida e está em liquidação. Seu antigo administrador, mesmo assim, continua assinando contratos de novos negócios em nome da empresa.",
  question: "Considerando a fase de liquidação, assinale a alternativa correta.",
  options: [
    "É indevida, pois quem representa a sociedade em liquidação é o liquidante, com atos limitados às pendências.",
    "A conduta é válida, pois o administrador mantém todos os poderes até a partilha.",
    "A conduta é válida, desde que os novos contratos tenham lucro.",
    "A conduta é indevida apenas porque a sociedade ainda não fez a partilha entre os sócios."
  ],
  answer: 0,
  feedback: "Na liquidação, o **liquidante** assume a representação, e a sociedade só pratica atos necessários a resolver pendências. Novos negócios em nome da sociedade fogem desse limite."
},
// 8 - Liquidação e partilha
{
  aula: "Aula 10 - Dissolução de sociedades",
  tipo: "Análise Aplicada",
  texto: "A liquidação levanta o patrimônio da sociedade e paga as dívidas em aberto, e só depois ocorre a partilha do que restar entre os sócios, na proporção de suas partes. Em uma sociedade dissolvida, os sócios, ansiosos para receber, querem dividir logo entre si o saldo da conta bancária da empresa, embora ainda existam dívidas com fornecedores e com o fisco.",
  question: "Considerando a ordem das fases da dissolução total, assinale a alternativa correta.",
  options: [
    "Os sócios podem dividir o saldo agora e pagar as dívidas depois, com os próprios recursos da partilha.",
    "As dívidas passam a ser dos sócios, que ficam livres para dividir o saldo na proporção de suas quotas.",
    "A partilha só ocorre depois de apurado o ativo e pagas as dívidas, com o remanescente.",
    "As dívidas deixam de existir com a dissolução, e o saldo pode ser dividido livremente."
  ],
  answer: 2,
  feedback: "A ordem é **dissolução, liquidação e partilha**. Primeiro se apura o ativo e se pagam as dívidas, e só o que ==proc==restar== é partilhado entre os sócios."
},
// 9 - Apuração dos haveres
{
  aula: "Aula 10 - Dissolução de sociedades",
  tipo: "Análise Aplicada",
  texto: "Quando a sociedade se resolve em relação a um sócio, o valor da sua quota é liquidado, salvo disposição contratual em contrário, com base na situação patrimonial da sociedade na data da resolução, verificada em balanço especialmente levantado. A quota liquidada é paga em dinheiro, no prazo de noventa dias, salvo acordo ou estipulação contratual (Art. 1.031). Joana se retirou de uma sociedade que continuará em atividade. O contrato social não trata do cálculo nem do pagamento dos haveres.",
  question: "Considerando a apuração dos haveres, assinale a alternativa correta.",
  options: [
    "A quota de Joana é paga pelo valor nominal, em doze parcelas mensais, sem balanço.",
    "Liquidação por balanço especial, com pagamento em 90 dias, salvo acordo.",
    "Joana nada recebe, pois a sociedade continua em funcionamento e o capital permanece.",
    "O valor é fixado livremente pelos sócios que permanecem, sem balanço."
  ],
  answer: 1,
  feedback: "A apuração dos haveres evita que os sócios que ficam se apropriem do capital de quem saiu. O valor segue o **balanço especial** da data da resolução, com pagamento em ==rule==90 dias==, salvo acordo."
},
// 10 - Dissolução por vontade na limitada
{
  aula: "Aula 10 - Dissolução de sociedades",
  tipo: "Análise Aplicada",
  texto: "Um dos casos de dissolução total é a vontade dos sócios, quando eles decidem de comum acordo encerrar as atividades, mesmo antes do prazo previsto. Na sociedade limitada, essa deliberação exige o voto de três quartos do capital social. Na sociedade anônima, ela é tratada em assembleia geral extraordinária. Em uma sociedade limitada, sócios que representam 60% do capital social querem dissolver a empresa e acreditam que a maioria é suficiente. Os 40% restantes são contra.",
  question: "Considerando as regras de dissolução por vontade dos sócios, assinale a alternativa correta.",
  options: [
    "Os 60% bastam, pois a dissolução voluntária se decide por maioria absoluta.",
    "A dissolução exige a unanimidade, sem exceções.",
    "Basta a metade do capital social para dissolver a limitada.",
    "Não bastam: a limitada exige três quartos do capital social."
  ],
  answer: 3,
  feedback: "Na **sociedade limitada**, a dissolução por vontade dos sócios exige ==rule==3/4== do capital. Com 60%, o quórum não é atingido, e a deliberação não se aprova."
},
// ===== AULA 11 =====
// 1 - Sujeitos à falência
{
  aula: "Aula 11 - Falência",
  tipo: "Conceitual Contextualizada",
  texto: "A falência é instituto próprio do devedor empresário e da sociedade empresária. A Lei nº 11.101/2005 não se aplica a certos devedores, como instituições financeiras, cooperativas de crédito, consórcios, seguradoras, operadoras de planos de saúde, sociedades de capitalização, empresas públicas e sociedades de economia mista (Art. 2º). O Banco Horizonte S.A. é uma instituição financeira com dívidas vencidas e sem recursos para pagá-las. Alguns credores ajuizaram pedido de falência dele com base na Lei nº 11.101/2005.",
  question: "Considerando os devedores sujeitos à lei de falências, assinale a alternativa correta.",
  options: [
    "O pedido é cabível, pois qualquer sociedade anônima é empresária e se sujeita à lei de falências.",
    "O pedido só é cabível se o banco for uma sociedade anônima aberta.",
    "A lei não se aplica às instituições financeiras, que têm regime próprio.",
    "O pedido é cabível, mas quem decide o processo é a assembleia geral de credores."
  ],
  answer: 2,
  feedback: "O Art. 2º exclui as **instituições financeiras** da Lei nº 11.101/2005. Mesmo sendo empresária, ela se submete a ==rule==regime próprio== de liquidação."
},
// 2 - Legitimidade ativa
{
  aula: "Aula 11 - Falência",
  tipo: "Análise Aplicada",
  texto: "Podem requerer a falência do devedor o próprio devedor (autofalência), o cônjuge sobrevivente, o herdeiro, o inventariante, o sócio ou acionista e qualquer credor. O credor que for empresário deve provar a regularidade de sua atividade empresarial (Art. 97). A empresa Delta Ltda., devedora de uma fornecedora, está insolvente. A fornecedora, que é empresária individual, nunca registrou sua atividade na Junta Comercial, mas pretende requerer a falência de Delta.",
  question: "Considerando a legitimidade para requerer a falência, assinale a alternativa correta.",
  options: [
    "Não prospera, pois o credor empresário deve provar sua regularidade.",
    "O pedido é válido, pois qualquer credor pode requerer a falência sem nenhuma condição.",
    "Somente a própria Delta pode requerer a falência dela.",
    "Somente o Ministério Público pode requerer a falência de empresa insolvente."
  ],
  answer: 0,
  feedback: "Qualquer credor tem legitimidade, mas o **credor empresário** precisa ==rule==provar a regularidade== de sua atividade. A fornecedora, sem registro, não cumpre essa exigência."
},
// 3 - Pressupostos
{
  aula: "Aula 11 - Falência",
  tipo: "Análise Aplicada",
  texto: "Para a falência são necessários três pressupostos: devedor empresário, insolvência e sentença declaratória de falência. A insolvência é a incapacidade de pagar as dívidas, e se caracteriza, por exemplo, pela impontualidade injustificada, pela prática de atos de falência e pela execução frustrada. Rui, empresário, deixou de pagar no vencimento um título protestado, sem apresentar relevante razão de direito. Um credor quer saber se, por isso, Rui já está falido.",
  question: "Considerando os pressupostos da falência, assinale a alternativa correta.",
  options: [
    "A falência decorre automaticamente do protesto, sem necessidade de sentença.",
    "A impontualidade justificada de uma dívida basta para caracterizar a insolvência.",
    "Somente o próprio Rui pode pedir a falência, pois o credor não tem legitimidade.",
    "Há impontualidade injustificada, mas a falência só existe com a sentença declaratória."
  ],
  answer: 3,
  feedback: "A **impontualidade injustificada** é uma das formas de caracterizar a insolvência, mas o estado de falência só nasce com a ==def==sentença declaratória==, o terceiro pressuposto."
},
// 4 - Falência x recuperação
{
  aula: "Aula 11 - Falência",
  tipo: "Conceitual Contextualizada",
  texto: "A falência gera o fim da atividade empresarial, e o devedor perde o direito de administrar seus bens e deles dispor. A recuperação judicial, por sua vez, possibilita a continuidade da atividade, e o devedor e os administradores são mantidos, mas ficam sob fiscalização do comitê e do administrador judicial, se houver. A diretora de uma empresa em crise financeira quer entender a diferença entre as duas situações antes de decidir como agir.",
  question: "Considerando a diferença entre falência e recuperação judicial, assinale a alternativa correta.",
  options: [
    "Na falência a atividade continua com o devedor, e na recuperação ela é encerrada.",
    "Na falência a atividade acaba, e na recuperação ela continua sob fiscalização.",
    "Nos dois institutos o devedor é afastado da administração e perde seus bens.",
    "Na recuperação judicial o devedor perde o direito de dispor de seus bens, e na falência ele permanece sob fiscalização."
  ],
  answer: 1,
  feedback: "A **falência** encerra a atividade e afasta o devedor, e a ==def==recuperação judicial== busca preservar a atividade, mantendo o devedor sob fiscalização."
},
// 5 - Ordem de pagamento
{
  aula: "Aula 11 - Falência",
  tipo: "Análise Aplicada",
  texto: "Na falência, o pagamento dos créditos segue uma ordem legal, em respeito à igualdade entre os credores da mesma classe (par conditio creditorum). Na lei, a classificação é: créditos trabalhistas (até 150 salários mínimos por credor) e acidentários, créditos com garantia real, créditos tributários, créditos com privilégio especial, créditos com privilégio geral, créditos quirografários, multas e, por último, os créditos subordinados. Na falência da empresa Gama, há os seguintes credores: um empregado com crédito trabalhista de 80 salários mínimos, um banco com garantia real, um fornecedor quirografário e um sócio com crédito subordinado.",
  question: "Considerando a ordem de preferência dos créditos, assinale a alternativa que apresenta a sequência correta de pagamento.",
  options: [
    "Empregado, banco com garantia real, fornecedor quirografário e sócio com crédito subordinado.",
    "Banco com garantia real, empregado, fornecedor quirografário e sócio com crédito subordinado.",
    "Fornecedor quirografário, empregado, banco com garantia real e sócio com crédito subordinado.",
    "Sócio com crédito subordinado, fornecedor quirografário, banco com garantia real e empregado."
  ],
  answer: 0,
  feedback: "Pela ordem legal, o crédito **trabalhista**, até o limite de 150 salários mínimos, vem antes do crédito com garantia real. Em seguida vêm os quirografários e, por fim, os ==term==subordinados==."
},
// 6 - Atos ineficazes
{
  aula: "Aula 11 - Falência",
  tipo: "Análise Aplicada",
  texto: "Alguns atos praticados pelo devedor antes da falência são ineficazes em relação à massa falida, ainda que não haja prova de fraude. Entre eles estão o pagamento de dívidas vincendas, a constituição de garantia real para dívida anterior e a prática de atos a título gratuito até dois anos antes da decretação da falência (Arts. 129 e 130 da Lei nº 11.101/2005). A empresa Delta doou um veículo de sua frota a um parente do sócio principal 18 meses antes da decretação de sua falência. O administrador judicial quer saber se pode contestar essa doação.",
  question: "Considerando os atos ineficazes na falência, assinale a alternativa correta.",
  options: [
    "A doação é válida, pois só os atos praticados nos 90 dias anteriores ao pedido de falência podem ser considerados ineficazes.",
    "A doação é válida, pois foi feita antes da sentença de falência, e atos anteriores nunca são atingidos.",
    "A doação é ineficaz perante a massa, pois ato gratuito até dois anos antes da falência não a vincula.",
    "A doação é nula e gera automaticamente a prisão do sócio principal."
  ],
  answer: 2,
  feedback: "Os **atos gratuitos** praticados até **dois anos** antes da decretação da falência são ineficazes perante a massa. Os 90 dias do termo legal são outro critério, e a ineficácia não depende de prova de má-fé."
},
// 7 - Efeitos da sentença
{
  aula: "Aula 11 - Falência",
  tipo: "Análise Aplicada",
  texto: "A sentença que decreta a falência produz efeitos importantes: resulta na falência dos sócios com responsabilidade ilimitada, retira do falido o direito de administrar seus bens e deles dispor, e o inabilita para o exercício de atividade empresarial (Arts. 102 e 103 da Lei nº 11.101/2005). A sociedade Ômega, constituída em nome coletivo, teve sua falência decretada. Seus três sócios respondem ilimitadamente pelas obrigações sociais. Um deles pergunta ao advogado o que acontecerá com ele a partir da sentença.",
  question: "Considerando os efeitos da sentença de falência, assinale a alternativa correta.",
  options: [
    "Somente a sociedade é atingida, e os sócios continuam com plena liberdade para administrar seus bens.",
    "O falido continua administrando seus bens normalmente, sob fiscalização do juiz.",
    "A sentença extingue imediatamente todas as dívidas da sociedade e dos sócios.",
    "A falência atinge também os sócios de responsabilidade ilimitada, que ficam inabilitados."
  ],
  answer: 3,
  feedback: "Em sociedades em que os sócios têm **responsabilidade ilimitada**, a falência da sociedade acarreta a falência deles. O ==warn==inabilitação== para a atividade empresarial é um dos efeitos da sentença."
},
// 8 - Restituição
{
  aula: "Aula 11 - Falência",
  tipo: "Análise Aplicada",
  texto: "O proprietário de bens que estejam em poder do falido na data da decretação da falência pode pedir a restituição deles, e também pode pedir a restituição de coisa vendida a crédito e entregue ao devedor nos 15 dias anteriores ao requerimento de falência, ou o valor em dinheiro, se o bem não mais existir. A Ótica Lume recebeu, em 4 de março, óculos vendidos a crédito por um fornecedor. A falência foi requerida em 14 de março, e depois decretada. Os óculos ainda estavam no estoque da ótica.",
  question: "Considerando a restituição de bens na falência, assinale a alternativa correta sobre a situação do fornecedor.",
  options: [
    "O fornecedor só pode habilitar seu crédito como quirografário, sem direito algum à restituição.",
    "Pode pedir a restituição, pois a entrega ocorreu nos 15 dias anteriores ao requerimento.",
    "O fornecedor só poderia pedir a restituição se a entrega ocorresse 30 dias antes do requerimento.",
    "A restituição só é cabível para bens de propriedade do próprio falido."
  ],
  answer: 1,
  feedback: "A entrega ocorreu **dez dias** antes do requerimento, dentro do prazo de 15 dias. Por isso cabe o pedido de ==proc==restituição== da coisa vendida a crédito ou do seu valor, se ela não existir mais."
},
// 9 - Juízo falimentar
{
  aula: "Aula 11 - Falência",
  tipo: "Análise Aplicada",
  texto: "O juízo falimentar é indivisível e universal: em regra, todas as ações sobre bens, interesses e negócios do falido são julgadas por ele. A lei prevê exceções, como as causas trabalhistas, as causas fiscais e as ações em que o falido seja autor ou litisconsorte ativo, não reguladas pela lei de falências. Um ex-empregado de uma empresa que faliu tem uma ação trabalhista em andamento contra ela. O advogado da massa falida afirma que a ação deve ser enviada ao juízo falimentar.",
  question: "Considerando a competência do juízo falimentar, assinale a alternativa correta.",
  options: [
    "A ação deve ser obrigatoriamente transferida ao juízo falimentar, que é universal e sem exceções.",
    "A ação deve ficar suspensa até o encerramento da falência.",
    "A causa trabalhista é exceção e segue na Justiça do Trabalho.",
    "A ação se extingue com a decretação da falência, e o empregado perde o direito."
  ],
  answer: 2,
  feedback: "As **causas trabalhistas** são exceção à indivisibilidade do juízo falimentar e seguem na Justiça do Trabalho. O crédito apurado é depois ==proc==habilitado== no processo de falência, na ordem de preferência."
},
// 10 - Encerramento
{
  aula: "Aula 11 - Falência",
  tipo: "Análise Aplicada",
  texto: "A falência é encerrada depois da realização do ativo e do pagamento dos credores, com relatório do administrador judicial e sentença do juiz. O prazo prescricional das obrigações do falido recomeça a correr no dia em que transitar em julgado a sentença de encerramento da falência (Art. 157 da Lei nº 11.101/2005). A falência de uma empresa foi encerrada por sentença que transitou em julgado em 10 de junho. Um credor, que não recebeu integralmente seu crédito, pergunta quando o prazo prescricional das obrigações do falido volta a correr.",
  question: "Considerando o encerramento da falência, assinale a alternativa correta.",
  options: [
    "O prazo recomeça a correr no dia em que a sentença de encerramento transita em julgado.",
    "O prazo prescricional só recomeça a correr cinco anos depois da sentença de encerramento.",
    "O prazo prescricional nunca volta a correr, pois a falência suspende a prescrição definitivamente.",
    "O prazo prescricional conta da data da decretação da falência, e não do encerramento."
  ],
  answer: 0,
  feedback: "Durante a falência, a ==def==prescrição== fica suspensa. Com o **trânsito em julgado** da sentença de encerramento, o prazo das obrigações do falido volta a correr nesse mesmo dia."
},
],

ava: [
  // aula: Atividade 4 - Aulas 9 e 10

// 1 - Soberania x livre iniciativa
{
  aula: "Atividade 4 - Aulas 9 e 10",
  tipo: "",
  texto: "Lei do Pará limitando empresas estrangeiras na mineração; multinacionais alegam violação à livre iniciativa.",
  question: "À luz da soberania nacional e da livre iniciativa:",
  code: "",
  options: [
    "O Estado brasileiro é impedido de impor qualquer restrição à atividade empresarial de empresas estrangeiras.",
    "A livre iniciativa tem prevalência absoluta e não admite restrições mesmo por interesse público.",
    "O princípio da soberania nacional aplica-se apenas a políticas externas, não interferindo nas relações econômicas internas.",
    "A soberania nacional permite ao Estado intervir na economia quando houver interesse público, mesmo que haja limitações à livre iniciativa."
  ],
  answer: 3,
  feedback: "Base: CF, arts. 1º, I e IV, 170, I e 174. Na vida real, a lei estadual seria inconstitucional por invadir a competência da União (arts. 20, IX, e 22, XII).",
  chips: []
},

// 2 - Teoria da empresa (asserção e razão)
{
  aula: "Atividade 4 - Aulas 9 e 10",
  tipo: "",
  texto: "Asserção (A): O Direito Empresarial moderno considera as atividades agrícolas e de serviços como parte do seu campo de regulação. Razão (R): A adoção da teoria da empresa, originada no modelo italiano, permitiu a ampliação do conceito de atividade empresarial.",
  question: "",
  code: "",
  options: [
    "A é verdadeira e R é falsa.",
    "As asserções A e R são verdadeiras, e R justifica A.",
    "As asserções A e R são verdadeiras, mas R não justifica A.",
    "A é falsa e R é verdadeira."
  ],
  answer: 1,
  feedback: "Base: CC, arts. 966 e 971.",
  chips: []
},

// 3 - Tratamento diferenciado a pequenas empresas
{
  aula: "Atividade 4 - Aulas 9 e 10",
  tipo: "",
  texto: "Empresa \"Semente do Brasil\" (cultivo orgânico no sertão nordestino), com dificuldade de crédito e incentivos, busca tratamento diferenciado.",
  question: "É correto afirmar:",
  code: "",
  options: [
    "Empresas como a \"Semente do Brasil\" podem pleitear o tratamento diferenciado previsto na Constituição e regulamentado por legislação complementar.",
    "O tratamento favorecido a pequenas empresas é prática informal e não possui respaldo jurídico expresso.",
    "A Constituição Federal prevê apenas incentivos para grandes corporações, por representarem maior arrecadação fiscal.",
    "A atuação da empresa no sertão não a qualifica para incentivos estatais, pois a desigualdade regional não é critério relevante para a ordem econômica constitucional."
  ],
  answer: 0,
  feedback: "Base: CF, arts. 170, IX, e 179; LC 123/2006.",
  chips: []
},

// 4 - Modelo francês x italiano
{
  aula: "Atividade 4 - Aulas 9 e 10",
  tipo: "",
  texto: "Diferenças entre o modelo francês (atos de comércio) e o italiano (teoria da empresa): I. O modelo francês foca nos atos praticados, independentemente do agente. II. A teoria da empresa considera a atividade econômica organizada como elemento central. III. A teoria dos atos de comércio é mais abrangente e moderna do que a teoria da empresa. IV. O modelo italiano está alinhado com a visão contemporânea do mercado.",
  question: "",
  code: "",
  options: [
    "II e IV",
    "II, III e IV",
    "I, II e IV",
    "I e III"
  ],
  answer: 2,
  feedback: "O item III está invertido.",
  chips: []
},

// 5 - Teoria da empresa no CC/2002
{
  aula: "Atividade 4 - Aulas 9 e 10",
  tipo: "",
  texto: "Empresa familiar agrícola vai exportar; o gestor jurídico cita a teoria da empresa do CC/2002.",
  question: "Assinale a correta:",
  code: "",
  options: [
    "O foco da teoria da empresa está nos atos isolados praticados pelas pessoas físicas, e não na atividade organizada.",
    "O Código Civil de 2002 adotou a teoria dos atos de comércio, mantendo o modelo francês de regulação.",
    "A teoria da empresa foca na atividade econômica organizada para a produção ou circulação de bens ou serviços.",
    "A teoria da empresa considera apenas as atividades industriais, limitando a sua aplicação às sociedades anônimas."
  ],
  answer: 2,
  feedback: "Base: CC, art. 966. Produtor rural só vira empresário ao se inscrever (art. 971).",
  chips: []
},

// 6 - Função social e pandemia
{
  aula: "Atividade 4 - Aulas 9 e 10",
  tipo: "",
  texto: "Medidas emergenciais na pandemia de COVID-19 limitaram atividades em transporte e saúde e impuseram obrigações de serviço essencial.",
  question: "Estão em conformidade com:",
  code: "",
  options: [
    "O princípio da defesa do consumidor, aplicável somente em relações privadas de consumo.",
    "O princípio da função social da propriedade, que autoriza medidas em prol do bem coletivo.",
    "O princípio da soberania popular, que prioriza os interesses da maioria por meio de plebiscitos.",
    "O princípio da livre concorrência, que impede qualquer intervenção estatal."
  ],
  answer: 1,
  feedback: "Base: CF, arts. 5º, XXIII, 170, III, e 196.",
  chips: []
},

// 7 - Função social da propriedade
{
  aula: "Atividade 4 - Aulas 9 e 10",
  tipo: "",
  texto: "Estudante de Direito defende, no TCC, que a propriedade deve ser respeitada em sua plenitude, independentemente de sua destinação social.",
  question: "A conclusão do estudante:",
  code: "",
  options: [
    "Está parcialmente correta, pois só há restrição à propriedade em caso de desapropriação.",
    "Está correta, pois a função social é um princípio moral, não jurídico.",
    "Está correta, pois a Constituição assegura o direito de propriedade como cláusula pétrea.",
    "Está equivocada, pois a função social limita o uso da propriedade empresarial, exigindo contribuição ao bem coletivo."
  ],
  answer: 3,
  feedback: "Base: CF, arts. 5º, XXII e XXIII, e 170, III. A letra c é a pegadinha: cláusula pétrea não torna o direito absoluto.",
  chips: []
},

// 8 - Redução das desigualdades
{
  aula: "Atividade 4 - Aulas 9 e 10",
  tipo: "",
  texto: "Startup \"EcoByte\" quer se instalar em região menos favorecida e busca incentivos.",
  question: "Qual princípio constitucional justifica o pleito?",
  code: "",
  options: [
    "Propriedade privada.",
    "Livre concorrência.",
    "Redução das desigualdades regionais e sociais.",
    "Defesa do consumidor."
  ],
  answer: 2,
  feedback: "Base: CF, arts. 3º, III, 43 e 170, VII.",
  chips: []
},

// 9 - Direito Empresarial x Civil
{
  aula: "Atividade 4 - Aulas 9 e 10",
  tipo: "",
  texto: "Consultoria para negócio de produtos sustentáveis no sertão nordestino; dúvida entre Direito Civil e Empresarial.",
  question: "É correto afirmar:",
  code: "",
  options: [
    "Apenas sociedades mercantis com fins lucrativos estão submetidas ao Direito Empresarial.",
    "O Direito Empresarial regula qualquer atividade econômica organizada, não se limitando aos atos de comércio.",
    "O regime jurídico empresarial aplica-se somente a empresas com capital social superior a R$ 500.000,00.",
    "O Direito Comercial, por ter se originado do feudalismo, ainda regula as atividades econômicas no Brasil."
  ],
  answer: 1,
  feedback: "Base: CC, art. 966.",
  chips: []
},

// 10 - Evolução histórica
{
  aula: "Atividade 4 - Aulas 9 e 10",
  tipo: "",
  texto: "Startup em formalização; o advogado explica a evolução histórica do Direito Empresarial: I. O Direito Comercial nasceu com as corporações de ofício, que regulavam práticas comerciais locais. II. A teoria dos atos de comércio foi suficiente para regular todas as novas formas de negócios surgidas com o capitalismo. III. A teoria da empresa possibilita maior flexibilidade e justiça no tratamento das diferentes formas de atividade econômica. IV. A transição do Direito Comercial para o Empresarial ampliou o escopo da legislação, abarcando mais setores da economia.",
  question: "",
  code: "",
  options: [
    "I, III e IV",
    "II, III e IV",
    "I e II",
    "II e III"
  ],
  answer: 0,
  feedback: "O item II é falso.",
  chips: []
},

// aula: Atividade 5 - Aulas 9 e 10

// 1 - Designer freelancer
{
  aula: "Atividade 5 - Aulas 9 e 10",
  tipo: "",
  texto: "Em uma ação judicial, uma autora afirma ser empresária por atuar como designer freelancer, com alguns contratos de prestação de serviços e sem vínculo com empregados ou estrutura organizada.",
  question: "Com base no conceito de empresário no Código Civil:",
  code: "",
  options: [
    "A autora é empresária desde que tenha faturamento anual acima do limite do MEI.",
    "A autora é empresária, pois há habitualidade na prestação de serviço com finalidade lucrativa.",
    "A autora não é empresária, pois não exerce atividade organizada nem possui estrutura empresarial.",
    "A autora não é empresária, pois a atividade de design gráfico é regulamentada por conselhos profissionais."
  ],
  answer: 2,
  feedback: "falta o elemento \"organização\" (art. 966). O faturamento e o MEI não definem o empresário, habitualidade e lucro não bastam, e a regulamentação por conselho não é o critério.",
  chips: []
},

// 2 - Fisioterapeuta e elemento de empresa
{
  aula: "Atividade 5 - Aulas 9 e 10",
  tipo: "",
  texto: "Joana é fisioterapeuta e abriu uma clínica onde atende pacientes, comercializa produtos ortopédicos, emprega secretárias, profissionais da área da saúde e realiza parcerias com academias locais. Considerando os elementos que caracterizam o empresário, analise a situação.",
  question: "A partir do caso apresentado, é correto afirmar que Joana:",
  code: "",
  options: [
    "É empresária, pois sua atividade extrapola o exercício intelectual individual e constitui elemento de empresa.",
    "É empresária, pois a prestação de serviços de saúde é suficiente para essa caracterização.",
    "Não é empresária, pois apenas pessoas jurídicas podem ser consideradas empresárias.",
    "Não é empresária, pois sua atividade principal é de natureza científica, ainda que com colaboradores."
  ],
  answer: 0,
  feedback: "profissão intelectual só é empresarial quando constitui elemento de empresa (parágrafo único do art. 966). Aqui há organização dos fatores de produção. Pessoa física também pode ser empresária.",
  chips: []
},

// 3 - O que não é empresário individual
{
  aula: "Atividade 5 - Aulas 9 e 10",
  tipo: "",
  texto: "",
  question: "Nos termos do Código Civil, não se confunde com empresário individual:",
  code: "",
  options: [
    "O produtor rural que exerce atividade organizada e com finalidade econômica.",
    "O comerciante que mantém estoque, fornecedores e clientes fixos.",
    "O artista que realiza shows esporádicos, ainda que bem remunerados.",
    "A pessoa física que atua de forma habitual na venda de produtos artesanais."
  ],
  answer: 2,
  feedback: "o artista com shows esporádicos não tem habitualidade nem organização, e exerce profissão intelectual/artística (parágrafo único do art. 966). Os demais podem ser empresários individuais (o produtor rural, pelo art. 971).",
  chips: []
},

// 4 - Teoria da Empresa
{
  aula: "Atividade 5 - Aulas 9 e 10",
  tipo: "",
  texto: "A partir do Código Civil de 2002, o Brasil passou a adotar a Teoria da Empresa, rompendo com a antiga Teoria dos Atos de Comércio. Esse novo modelo implica uma mudança na forma de identificar o sujeito de direito na relação empresarial.",
  question: "Considerando esse contexto histórico-jurídico, assinale a afirmativa correta:",
  code: "",
  options: [
    "O Código Civil de 2002 passou a considerar a empresa como sujeito de direito autônomo.",
    "O Código Civil manteve a teoria dos atos de comércio, por sua clareza conceitual.",
    "A Teoria da Empresa identifica o empresário como aquele que exerce atividade econômica organizada.",
    "A Teoria da Empresa privilegia o objeto da atividade e não o sujeito que a realiza."
  ],
  answer: 2,
  feedback: "a empresa é a atividade, não um sujeito de direito (o sujeito é o empresário ou a sociedade empresária). O CC/2002 rompeu com a teoria dos atos de comércio do Código Comercial de 1850. A teoria da empresa foca no modo de exercer a atividade.",
  chips: []
},

// 5 - Atividade empresarial
{
  aula: "Atividade 5 - Aulas 9 e 10",
  tipo: "",
  texto: "",
  question: "A atividade exercida por uma pessoa física que organiza os fatores de produção (capital, trabalho e tecnologia) com habitualidade, visando lucro, caracteriza:",
  code: "",
  options: [
    "Trabalho subordinado.",
    "Profissão regulamentada.",
    "Atividade empresarial.",
    "Contrato de prestação de serviço."
  ],
  answer: 2,
  feedback: "organizar os fatores de produção de forma habitual e lucrativa é a atividade empresarial do art. 966 (empresário individual, se for pessoa física).",
  chips: []
},

// 6 - Empresário sem registro
{
  aula: "Atividade 5 - Aulas 9 e 10",
  tipo: "",
  texto: "Ricardo é proprietário de um pequeno negócio de revenda de eletrônicos. Organizou sua atividade com investimento em tecnologia, contratação de funcionários, planejamento financeiro e marketing. Entretanto, ainda não formalizou o negócio na Junta Comercial.",
  question: "Com base no conceito de empresário e na legislação civil:",
  code: "",
  options: [
    "Ricardo não é empresário porque atua no comércio de produtos industrializados.",
    "Ricardo já é considerado empresário, pois exerce atividade econômica organizada de forma profissional.",
    "Ricardo é empresário somente a partir da obtenção de CNPJ na Receita Federal.",
    "Ricardo não é considerado empresário, pois o registro é condição essencial para essa classificação."
  ],
  answer: 1,
  feedback: "a condição de empresário decorre do exercício da atividade, não do registro. Sem o registro (art. 967) ele é empresário irregular/de fato, com restrições, mas continua sendo empresário. CNPJ é só inscrição fiscal.",
  chips: []
},

// 7 - Quem não é empresário
{
  aula: "Atividade 5 - Aulas 9 e 10",
  tipo: "",
  texto: "",
  question: "De acordo com o Código Civil brasileiro, não é considerado empresário:",
  code: "",
  options: [
    "A sociedade que exerce atividade econômica organizada, com fins lucrativos.",
    "O médico que abre uma clínica com contabilidade regular e empregados contratados.",
    "O profissional liberal que presta serviços técnicos com habitualidade.",
    "O agricultor que realiza atividade rural com estrutura empresarial organizada."
  ],
  answer: 2,
  feedback: "profissão intelectual sem elemento de empresa fica fora do conceito (parágrafo único do art. 966). Habitualidade sozinha não basta. As demais são empresárias ou podem ser (sociedade empresária, art. 982; clínica com estrutura; empresário rural, art. 971).",
  chips: []
},

// 8 - Ateliê de costura
{
  aula: "Atividade 5 - Aulas 9 e 10",
  tipo: "",
  texto: "Pedro é dono de um ateliê de costura onde trabalha sozinho, produzindo roupas sob encomenda. Ele não possui empregados nem utiliza tecnologias ou sistemas complexos de produção.",
  question: "De acordo com o conceito de empresário previsto no Código Civil, assinale a alternativa correta:",
  code: "",
  options: [
    "Pedro é empresário apenas se registrar-se na Junta Comercial.",
    "Pedro será empresário se possuir fins lucrativos, independentemente de outros fatores.",
    "Pedro não é empresário, pois a ausência de organização afasta a caracterização legal.",
    "Pedro é empresário porque exerce atividade econômica de produção de bens."
  ],
  answer: 2,
  feedback: "falta a organização dos fatores de produção. O registro não cria o empresário, o lucro não basta e produzir bens, por si só, não caracteriza o empresário.",
  chips: []
},

// 9 - Requisitos do empresário individual
{
  aula: "Atividade 5 - Aulas 9 e 10",
  tipo: "",
  texto: "",
  question: "Sobre os requisitos legais para caracterização do empresário individual, assinale a alternativa correta:",
  code: "",
  options: [
    "O empresário pode exercer qualquer atividade, inclusive as de natureza intelectual, sem restrições.",
    "A inscrição no Registro Público de Empresas é facultativa.",
    "É essencial que haja pelo menos dois sócios no exercício da atividade.",
    "O empresário deve exercer profissionalmente atividade econômica organizada para a produção ou circulação de bens ou serviços."
  ],
  answer: 3,
  feedback: "reproduz o art. 966. Há restrição para atividades intelectuais (parágrafo único), a inscrição é obrigatória (art. 967; facultativa só para o empresário rural, art. 971) e o empresário individual é uma única pessoa.",
  chips: []
},

// 10 - Padaria
{
  aula: "Atividade 5 - Aulas 9 e 10",
  tipo: "",
  texto: "Pedro é proprietário de uma padaria no interior do estado, onde trabalha sozinho, sem qualquer auxílio de empregados, ainda que realize atividades organizadas de venda de produtos alimentícios, compre mercadorias para revenda e mantenha fluxo de caixa.",
  question: "Considerando os critérios do Código Civil, é correto afirmar que Pedro:",
  code: "",
  options: [
    "Somente será empresário se estiver inscrito como MEI – Microempreendedor Individual.",
    "Não é considerado empresário, pois não há pluralidade de agentes no negócio.",
    "Não pode ser considerado empresário por não exercer profissão habitual.",
    "Pode ser considerado empresário, mesmo sendo individual e sem empregados, se atender aos requisitos da atividade organizada e profissional."
  ],
  answer: 3,
  feedback: "o art. 966 não exige empregados nem pluralidade de pessoas. O que importa é a organização da atividade. MEI é só enquadramento, e o empresário individual é por definição uma pessoa só. Comparação com a Questão 8: no ateliê, o enunciado afasta a organização (sem estrutura nenhuma), então não é empresário. Na padaria, o enunciado afirma que há atividade organizada, então pode ser. O critério decisivo é sempre a organização, não o número de empregados.",
  chips: []
},
]
};