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

};