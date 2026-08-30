// ============================================================
// NEXUS STUDY — quiz/conteudo/2026.2/AP1/ques_legislacao.js
// ============================================================
window.questoes = {

  // Questões de Banco de dados 
  questoes: [],


  enade: [],


  fixacao: [],

  ava: 
[
  // aula: Atividade 2 - Aula 3 e 4 (Pode haver questões erradas)
// obs: por favor, revisem com atenção — tecnicamente há uma questão que pode estar incorreta.
// Ela já foi corrigida com apoio de IA, mas ainda pode conter algum equívoco residual. Confiram antes de usar.
  // 1 - redução salarial
  {
    aula: "Atividade 2 - Aula 3 e 4 (Pode haver questões erradas)",
    tipo: "Aplicação",
    texto: "Uma empresa de médio porte, enfrentando dificuldades financeiras, decidiu reduzir os salários de seus funcionários em 20% para evitar demissões. O gestor de RH foi informado da decisão e precisa avaliar a legalidade e os riscos dessa medida, considerando que a redução será feita sem a participação do sindicato.",
    question: "Como o gestor de RH deve agir diante dessa situação?",
    code: ``,
    options: [
      "Registrar a alteração contratual unilateral no sistema e na CTPS de todos os funcionários.",
      "Aceitar a decisão da empresa, pois a redução salarial é válida em qualquer hipótese de crise financeira.",
      "Negociar com o sindicato da categoria, pois a redução salarial só pode ocorrer mediante acordo ou convenção coletiva.",
      "Recomendar aos empregados que ajuízem ações individuais de rescisão indireta.",
      "Comunicar aos empregados que a decisão é definitiva e irreversível."
    ],
    answer: 2,
    feedback: "O salário é protegido pelo princípio da irredutibilidade salarial (art. 7º, VI, da Constituição Federal), que só admite exceção quando há negociação coletiva — acordo ou convenção coletiva de trabalho firmado com o sindicato da categoria. Uma redução imposta unilateralmente pelo empregador, sem essa negociação, é nula e pode gerar passivo trabalhista, inclusive o direito do empregado de pleitear a diferença salarial ou até a rescisão indireta do contrato. Por isso, o caminho correto do gestor de RH é buscar o sindicato para formalizar a medida dentro da legalidade."
  },

  // 2 - marcos históricos CLT
  {
    aula: "Atividade 2 - Aula 3 e 4 (Pode haver questões erradas)",
    tipo: "Aplicação",
    texto: "O Direito do Trabalho no Brasil teve um desenvolvimento marcado por transformações econômicas, sociais e políticas, que resultaram em marcos legislativos fundamentais.",
    question: "Analise as afirmativas:\n\nI. A Lei Áurea (1888) aboliu o trabalho escravo, criando a necessidade de regulamentação das relações de trabalho.\nII. A Constituição de 1934 trouxe direitos trabalhistas, como jornada de 8 horas e repouso semanal remunerado.\nIII. A Consolidação das Leis do Trabalho (CLT) foi instituída em 1943, durante o governo de Getúlio Vargas.\nIV. A Constituição de 1988 ampliou os direitos dos trabalhadores, incluindo FGTS e férias remuneradas.\n\nEstá correto o que se afirma em:",
    code: ``,
    options: [
      "II, III e IV apenas.",
      "I, II e IV apenas.",
      "I, II e III apenas.",
      "I, II, III e IV."
    ],
    answer: 3,
    feedback: "Todas as quatro afirmativas retratam corretamente marcos históricos do Direito do Trabalho brasileiro: a Lei Áurea (1888) encerrou o trabalho escravo e abriu espaço para uma relação de trabalho livre, que precisou ser regulamentada; a Constituição de 1934 foi a primeira a constitucionalizar direitos trabalhistas, como a jornada de 8 horas e o repouso semanal remunerado; a CLT, editada em 1943 no governo Vargas, consolidou e unificou a legislação trabalhista existente; e a Constituição de 1988 ampliou significativamente esses direitos, elevando o FGTS e as férias remuneradas (entre outros) a garantias constitucionais. Como as quatro afirmativas são verdadeiras, a resposta correta reúne todas elas."
  },

  // 3 - vínculo empregatício sem contrato escrito
  {
    aula: "Atividade 2 - Aula 3 e 4 (Pode haver questões erradas)",
    tipo: "Aplicação",
    texto: "Carlos foi contratado como auxiliar administrativo, mas não teve contrato escrito. Após 6 meses, foi dispensado sem justa causa e questiona se seu contrato era válido.",
    question: "Analise as afirmativas:\n\nI. A relação de emprego não precisa de contrato escrito para existir.\nII. A continuidade da relação de emprego é um princípio do Direito do Trabalho.\nIII. Carlos tem direito a todas as verbas trabalhistas previstas na CLT.\nIV. Sem contrato escrito, o vínculo é considerado inválido.\n\nEstá correto o que se afirma em:",
    code: ``,
    options: [
      "I, III e IV apenas.",
      "I, II e III apenas.",
      "II, III e IV apenas.",
      "II e IV apenas."
    ],
    answer: 1,
    feedback: "O contrato de trabalho é, em regra, um contrato consensual: basta a existência dos elementos da relação de emprego (pessoalidade, habitualidade, onerosidade e subordinação) para que o vínculo se configure, independentemente de formalização escrita — por isso a afirmativa I está correta. A continuidade da relação de emprego é, de fato, um princípio protetivo do Direito do Trabalho, que presume a manutenção do contrato no tempo e favorece o trabalhador em caso de dúvida (afirmativa II correta). Como o vínculo é válido mesmo sem registro escrito, Carlos tem direito a todas as verbas devidas por um contrato de trabalho regular, como aviso prévio, FGTS, saldo de salário e férias proporcionais (afirmativa III correta). Já a afirmativa IV está errada, pois a ausência de contrato escrito não invalida o vínculo — pelo contrário, ele pode e deve ser reconhecido judicialmente se comprovado."
  },

  // 4 - atraso na anotação da CTPS
  {
    aula: "Atividade 2 - Aula 3 e 4 (Pode haver questões erradas)",
    tipo: "Aplicação",
    texto: "Um empregado foi contratado em 1º de abril de 2023, mas sua Carteira de Trabalho e Previdência Social (CTPS) foi assinada apenas em 1º de junho do mesmo ano.",
    question: "Analise as afirmativas:\n\nI. A CTPS deve ser assinada no prazo de até 5 dias úteis após o início do trabalho.\nII. O período trabalhado sem registro será considerado como vínculo empregatício se comprovado.\nIII. O empregador pode ser multado pela ausência de anotação tempestiva.\nIV. O vínculo empregatício passa a valer apenas a partir da anotação em CTPS.\n\nEstá correto o que se afirma em:",
    code: ``,
    options: [
      "I, II e IV apenas.",
      "II e IV apenas.",
      "II, III e IV apenas.",
      "I, II e III apenas."
    ],
    answer: 3,
    feedback: "A legislação trabalhista exige que a anotação na CTPS seja feita em até 5 dias úteis a partir do início da prestação de serviços (afirmativa I correta). Ainda que essa anotação seja feita com atraso, o período efetivamente trabalhado sem registro é considerado vínculo empregatício, desde que comprovado por outros meios, como testemunhas ou documentos (afirmativa II correta). Além disso, o descumprimento do prazo de anotação sujeita o empregador a multa administrativa, fiscalizada pelo Ministério do Trabalho (afirmativa III correta). A afirmativa IV está incorreta porque a CTPS tem natureza declaratória, e não constitutiva do vínculo: o contrato de trabalho já existe desde o início efetivo da prestação de serviços, e a anotação apenas formaliza e comprova o que já ocorre na prática."
  },

  // 5 - suspensão de contrato de trabalho
  {
    aula: "Atividade 2 - Aula 3 e 4 (Pode haver questões erradas)",
    tipo: "Aplicação",
    texto: "Devido a uma crise financeira, a empresa Beta pretende suspender temporariamente o contrato de alguns empregados para reduzir custos, com a ideia de recontratá-los futuramente. O dono da empresa consulta o gestor de RH sobre as implicações legais.",
    question: "Qual a orientação correta que o gestor de RH deve fornecer?",
    code: ``,
    options: [
      "A suspensão pode ser feita de forma unilateral pelo empregador, sem qualquer formalidade.",
      "A suspensão é possível, mas o empregador deve continuar pagando salários integralmente.",
      "A suspensão pode ser realizada em situações específicas, como durante cursos de qualificação, desde que com previsão em acordo ou convenção coletiva.",
      "A suspensão do contrato de trabalho não pode ocorrer em hipótese alguma."
    ],
    answer: 2,
    feedback: "A suspensão do contrato de trabalho é uma medida excepcional, prevista em situações específicas na CLT — por exemplo, o art. 476-A permite a suspensão para participação do empregado em curso ou programa de qualificação profissional, mediante acordo ou convenção coletiva de trabalho, com duração de 2 a 5 meses. Diferentemente da interrupção do contrato (em que o empregado continua recebendo salário mesmo afastado, como em férias ou licença médica), na suspensão não há prestação de serviços nem, em regra, pagamento de salário. Por isso, a suspensão não pode ser feita de forma unilateral e informal pelo empregador: ela exige previsão legal específica e, geralmente, negociação coletiva."
  },

  // 6 - férias vencidas em dobro
  {
    aula: "Atividade 2 - Aula 3 e 4 (Pode haver questões erradas)",
    tipo: "Aplicação",
    texto: "Joana completou um ano de trabalho na empresa Delta, mas o gestor de RH percebeu que o setor administrativo não concedeu as férias dentro do período concessivo de 12 meses subsequentes.",
    question: "Qual é a consequência legal para a empresa?",
    code: ``,
    options: [
      "A empresa deverá conceder férias coletivas para todos os funcionários como compensação.",
      "O trabalhador perde o direito às férias.",
      "A empresa não tem qualquer obrigação, desde que pague as férias quando o empregado solicitar.",
      "A empresa deverá pagar as férias em dobro, acrescidas do terço constitucional."
    ],
    answer: 3,
    feedback: "A CLT estabelece dois períodos relacionados às férias: o período aquisitivo (12 meses de trabalho que geram o direito) e o período concessivo (os 12 meses seguintes, dentro dos quais o empregador deve efetivamente conceder as férias). Se o empregador não concede as férias dentro do período concessivo, o art. 137 da CLT determina que ele deverá pagá-las em dobro, sempre acrescidas do terço constitucional previsto no art. 7º, XVII, da Constituição Federal. Trata-se de uma penalidade ao empregador pela mora na concessão, e o direito às férias do trabalhador não se perde em nenhuma hipótese."
  },

  // 7 - princípio da proteção e norma mais favorável
  {
    aula: "Atividade 2 - Aula 3 e 4 (Pode haver questões erradas)",
    tipo: "Aplicação",
    texto: "Um trabalhador ajuizou uma ação alegando que a convenção coletiva lhe conferia direito a um adicional maior do que o previsto na CLT. O juiz, ao analisar o caso, verificou a existência de normas diferentes e optou por aplicar a mais favorável ao trabalhador.",
    question: "Analise as afirmativas:\n\nI. O juiz aplicou corretamente o princípio da proteção.\nII. A aplicação da norma mais favorável visa equilibrar a relação entre empregado e empregador.\nIII. O princípio da proteção está previsto expressamente na CLT.\nIV. A escolha da norma mais favorável é obrigatória mesmo em contratos individuais.\n\nEstá correto o que se afirma em:",
    code: ``,
    options: [
      "I e II apenas.",
      "I, II, III e IV.",
      "II, III e IV apenas.",
      "I, II e IV apenas."
    ],
    answer: 0,
    feedback: "O princípio da proteção é o pilar central do Direito do Trabalho e se manifesta, entre outras formas, pela regra da norma mais favorável: quando há mais de uma norma aplicável ao caso, prevalece aquela que for mais benéfica ao trabalhador — foi exatamente isso que o juiz fez ao dar preferência à convenção coletiva em detrimento da CLT (afirmativa I correta). Essa lógica busca compensar a hipossuficiência do empregado na relação de trabalho, reequilibrando uma relação naturalmente desigual entre as partes (afirmativa II correta). Já as afirmativas III e IV extrapolam o que é tecnicamente correto: o princípio da proteção é uma construção doutrinária e jurisprudencial, sem previsão expressa e literal na CLT como regra geral (III incorreta), e a prevalência da norma mais favorável não se aplica de forma automática e obrigatória a qualquer contrato individual, dependendo do contexto e da hierarquia das fontes normativas em jogo (IV incorreta)."
  },

  // 8 - contrato de experiência
  {
    aula: "Atividade 2 - Aula 3 e 4 (Pode haver questões erradas)",
    tipo: "Aplicação",
    texto: "A empresa Alfa pretende contratar um novo funcionário para a área de logística. O dono da empresa está preocupado com a possibilidade de um rompimento precoce do contrato, o que poderia gerar custos com verbas rescisórias. O gerente de RH sugere a utilização de um contrato de experiência para avaliar a competência do candidato, explicando que esse tipo de contrato oferece segurança tanto para a empresa quanto para o empregado, caso o vínculo não seja mantido.",
    question: "Considerando as regras da CLT sobre contratos de experiência, qual alternativa expressa corretamente o que o gerente de RH pode afirmar ao dono da empresa?",
    code: ``,
    options: [
      "O contrato de experiência não pode ter prazo superior a 45 dias, sendo vedada qualquer prorrogação.",
      "O contrato de experiência pode ser prorrogado indefinidamente, desde que haja acordo entre as partes.",
      "O contrato de experiência pode ter prazo de até 90 dias, permitindo apenas uma prorrogação dentro desse limite.",
      "A rescisão antecipada do contrato de experiência implica no pagamento integral de todos os salários até completar 90 dias."
    ],
    answer: 2,
    feedback: "O contrato de experiência é uma modalidade de contrato por prazo determinado, prevista no art. 445, parágrafo único, da CLT, com duração máxima de 90 dias. Dentro desse limite, é permitida uma única prorrogação, desde que a soma dos períodos (contratação inicial + prorrogação) não ultrapasse os 90 dias totais. Não é permitida mais de uma prorrogação, nem prorrogação por tempo indeterminado. Em caso de rescisão antecipada, aplicam-se as regras dos arts. 479 e 480 da CLT: se quem rompe é o empregador, ele indeniza metade dos salários que faltariam para o fim do contrato; se é o empregado, ele indeniza a empresa em valor equivalente, e não há pagamento integral automático dos salários restantes."
  },

  // 9 - retroatividade da anotação em CTPS
  {
    aula: "Atividade 2 - Aula 3 e 4 (Pode haver questões erradas)",
    tipo: "Aplicação",
    texto: "A empresa Alfa contratou 10 novos funcionários em 10 de março, mas, por falha administrativa do setor de RH, a anotação na CTPS só foi feita no final de abril. Um dos funcionários, inconformado, acionou a Justiça do Trabalho, pedindo o reconhecimento do vínculo desde a data de início do serviço.",
    question: "Qual deve ser a postura correta do gestor de RH?",
    code: ``,
    options: [
      "Reconhecer que a anotação deve ser retroativa e regularizar imediatamente, evitando novas penalidades.",
      "Negar o vínculo, alegando falta de documentos.",
      "Argumentar que o vínculo se inicia apenas na data de anotação da CTPS.",
      "Sugerir a exclusão da anotação para evitar complicações judiciais.",
      "Defender que o vínculo só é válido mediante contrato formal assinado."
    ],
    answer: 0,
    feedback: "Como a CTPS tem função declaratória e não constitutiva do vínculo empregatício, o contrato de trabalho já existia desde 10 de março, data em que o funcionário efetivamente começou a prestar serviços — a anotação tardia em abril é apenas uma formalização atrasada dessa realidade. Diante disso, a postura correta e juridicamente segura do gestor de RH é reconhecer a retroatividade da anotação à data real de início do contrato e regularizar a situação imediatamente, evitando o agravamento de multas administrativas e a exposição da empresa a novas reclamações trabalhistas. Negar o vínculo, defender que ele só começa na data da anotação, ou sugerir a exclusão do registro seriam condutas que contrariam a lei e ainda aumentariam o risco jurídico da empresa."
  },

  // 10 - primazia da realidade
  {
    aula: "Atividade 2 - Aula 3 e 4 (Pode haver questões erradas)",
    tipo: "Aplicação",
    texto: "Um trabalhador contratado como \"prestador de serviços\" comprovou em juízo que trabalhava com habitualidade, subordinação e pessoalidade, recebendo salário fixo.",
    question: "Sobre a situação, considere:\n\nI. O contrato formal tem prevalência sobre a realidade do vínculo.\nII. A primazia da realidade garante que os fatos reais prevaleçam sobre o que está escrito.\nIII. O trabalhador poderá ter reconhecido vínculo de emprego, mesmo com contrato de prestação de serviços.\nIV. Subordinação e habitualidade são elementos essenciais do vínculo empregatício.\n\nEstá correto o que se afirma em:",
    code: ``,
    options: [
      "II, III e IV apenas.",
      "II e IV apenas.",
      "I e III apenas.",
      "I, II e III apenas."
    ],
    answer: 0,
    feedback: "O princípio da primazia da realidade estabelece que, havendo divergência entre o que está formalizado em contrato e o que efetivamente ocorre na prática, prevalecem os fatos reais da relação de trabalho, e não o rótulo dado ao contrato (afirmativa II correta, e I incorreta, pois é justamente o contrário: a realidade prevalece sobre a forma). Como o trabalhador comprovou a presença dos elementos característicos da relação de emprego — pessoalidade, habitualidade, subordinação e onerosidade —, o vínculo empregatício pode ser reconhecido judicialmente mesmo que o contrato formal o descreva como \"prestação de serviços\" (afirmativa III correta). Por fim, subordinação e habitualidade estão, de fato, entre os elementos essenciais que caracterizam a relação de emprego, distinguindo-a de outras formas de prestação de serviço, como o trabalho autônomo (afirmativa IV correta)."
  }
]


};