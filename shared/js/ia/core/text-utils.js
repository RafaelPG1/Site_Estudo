/**
 * NEXUS — shared/js/ia/core/text-utils.js
 *
 * Utilitários de texto compartilhados entre resumo/search.js e quiz/search.js.
 *
 * Responsabilidades:
 *   - Normalização de texto (acentos, caixa, pontuação)
 *   - Stemming simples para português
 *   - Vocabulário semântico centralizado (stopwords, intenções, domínios)
 *   - Função de score BM25-simplificado
 *   - Preparação de entrada para índice
 *   - Utilitários de detecção de intenção (containsAny, detectarIntencao)
 *
 * NÃO conhece:
 *   - Estrutura de resumo
 *   - Estrutura de quiz
 *   - DOM
 *   - Estado de sessão
 *
 * API pública: window.NexusTextUtils
 *
 * ── VOCABULÁRIO SEMÂNTICO ────────────────────────────────────────────────────
 *
 * Todos os conjuntos de termos são expostos como Sets normalizados
 * (sem acentos, minúsculas) para uso direto após normalizarTexto().
 *
 * Conjuntos disponíveis:
 *   STOPWORDS             — termos gramaticais e ruído sem valor semântico
 *   VERBOS_INTENCAO       — verbos que indicam pedido de ação ao assistente
 *   PALAVRAS_EXPLICACAO   — sinais de que o usuário quer uma explicação
 *   PALAVRAS_RESUMO       — sinais de que o usuário quer um resumo/síntese
 *   PALAVRAS_GABARITO     — sinais de que o usuário quer a resposta correta
 *   PALAVRAS_REFERENCIA_QUIZ — termos que apontam para questões/alternativas
 *   PALAVRAS_REFERENCIA_RESUMO — termos que apontam para conteúdo de resumo
 *   SAUDACOES             — cumprimentos e aberturas de conversa
 *   CONFIRMACOES          — expressões de concordância / "sim"
 *   NEGACOES              — expressões de discordância / "não"
 *   PALAVRAS_DUVIDA       — expressões que indicam confusão ou dúvida
 *   PALAVRAS_CONTINUIDADE — pronomes e expressões que referenciam algo anterior
 *   PALAVRAS_URGENCIA     — expressões de pressa ou pedido de síntese rápida
 *   EXPRESSOES_AFETIVAS   — gírias, interjeições e linguagem emocional
 *   ABREVIACOES_CHAT      — abreviações típicas de chat e mensagens de texto
 *   SINONIMOS             — mapa de normalização de variações para forma canônica
 */

(function () {
  'use strict';

  /* ════════════════════════════════════════════════════════════════════════
     § 1  NORMALIZAÇÃO
  ════════════════════════════════════════════════════════════════════════ */

  /**
   * Normaliza texto para busca: minúsculas, sem acentos, sem pontuação.
   *
   * @param {string} texto
   * @returns {string}
   */
  function normalizarTexto(texto) {
    if (typeof texto !== 'string') return '';
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* ════════════════════════════════════════════════════════════════════════
     § 2  STEMMING
  ════════════════════════════════════════════════════════════════════════ */

  /**
   * Stemming simples para português.
   * Remove sufixos comuns para melhorar recall na busca.
   *
   * @param {string} termo
   * @returns {string}
   */
  function stem(termo) {
    if (termo.length <= 4) return termo;

    const regras = [
      'amentos', 'imentos', 'amento',  'imento',
      'acoes',   'icoes',   'acao',    'icao',
      'adores',  'adoras',  'ador',    'adora',
      'mente',
      'ando',    'endo',    'indo',
      'ados',    'idas',    'idos',    'ado',    'ida',    'ido',
      'ares',    'eres',    'ires',    'ar',     'er',     'ir',
      'icas',    'icos',    'ica',     'ico',
      'osas',    'osos',    'osa',     'oso',
      'istas',   'ista',
      'veis',    'vel',
      'oes',     'aos',
      'es',      'os',      'as',
    ];

    for (var i = 0; i < regras.length; i++) {
      var suf = regras[i];
      if (termo.endsWith(suf) && termo.length - suf.length >= 4) {
        return termo.slice(0, termo.length - suf.length);
      }
    }

    return termo;
  }

  /* ════════════════════════════════════════════════════════════════════════
     § 3  VOCABULÁRIO SEMÂNTICO
     ─────────────────────────────────────────────────────────────────────
     Todos os termos são armazenados já normalizados (sem acentos,
     minúsculas) para permitir comparação direta com a saída de
     normalizarTexto(). Isso evita normalizar a cada consulta.
  ════════════════════════════════════════════════════════════════════════ */

  /* ── 3.1  STOPWORDS ──────────────────────────────────────────────────
     Termos sem valor semântico para busca: artigos, preposições,
     conjunções, pronomes gramaticais e ruído de chat.
     NÃO inclui verbos de intenção nem palavras de domínio — esses
     ficam em seus próprios conjuntos abaixo.
  ──────────────────────────────────────────────────────────────────── */

  const STOPWORDS = new Set([
    // Artigos
    'a','o','as','os','um','uma','uns','umas',
    // Preposições simples
    'de','da','do','das','dos','em','na','no','nas','nos',
    'por','para','ao','aos','pelo','pela','pelos','pelas',
    'ate','desde','entre','sobre','sob','ante','apos',
    'com','sem','contra','perante','mediante',
    // Contrações e combinações preposicionais comuns
    'num','numa','nuns','numas','duma','dum','dumas','duns',
    'pra','pro','pras','pros',
    // Conjunções
    'e','ou','mas','porem','contudo','todavia','entretanto',
    'porque','pois','ja','embora','quando','enquanto','se',
    'que','quem','qual','quais','onde','como','quanto',
    // Pronomes gramaticais
    'eu','tu','ele','ela','nos','vos','eles','elas',
    'me','te','lhe','lhes','se','si',
    'meu','minha','meus','minhas',
    'teu','tua','teus','tuas',
    'seu','sua','seus','suas',
    'nosso','nossa','nossos','nossas',
    'este','esta','estes','estas',
    'esse','essa','esses','essas',
    'aquele','aquela','aqueles','aquelas',
    'isto','isso','aquilo',
    // Advérbios genéricos sem valor semântico de busca
    'ai','dai','la','ca','so','ja','ate','bem','mal',
    'nao','sim','tambem','tb','tbm','tmb',
    'muito','pouco','mais','menos','tao','mt','mto',
    'assim','entao','pois','logo','ainda','alias',
    'alem','inclusive','exceto','salvo',
    // Verbos auxiliares / cópula
    'eh','sao','foi','era','sera','seria','seja','sejam',
    'tem','ter','tive','tinha','tera','teria',
    'ser','estar','estou','esta','estamos','estao',
    'sendo','tendo','estando','sido',
    'vai','vao','vou','vamos','ir',
    'pode','podem','podia','poderia',
    'deve','devem','devia','deveria',
    'quer','querem','queria',
    'faz','fazem','fazia','fez',
    'fica','ficam','ficou',
    // Pronomes interrogativos / relativos sem conteúdo semântico
    'oq','oque','oqe','qq','qualq',
    // Partículas e interjeições de chat sem valor semântico
    'voce','vc','ne','tipo','kind','la',
    'ok','okay','tudo','td','tds',
    'ta','tah','tá',
    // Numerais ordinais / cardinais de apoio
    'primeiro','segunda','terceiro',
    // Cumprimentos e fechamentos (duplicados de SAUDACOES — keeped para
    // que o filtro de stopwords continue funcionando sem depender de outros sets)
    'oi','ola','hey','hi','hello','eai','salve','opa',
    'bom','boa','noite','tarde','dia',
    // Expressões de preenchimento
    'entendeu','sabe','sacou','certo',
  ]);

  /* ── 3.2  VERBOS DE INTENÇÃO ─────────────────────────────────────────
     Verbos que indicam o tipo de ação que o usuário quer que o
     assistente execute. Usados para classificar a intenção da pergunta.
     Forma normalizada (sem acento, minúscula, sem pontuação).
  ──────────────────────────────────────────────────────────────────── */

  const VERBOS_INTENCAO = new Set([
    // Explicar / ensinar
    'explica','explique','explicar','explicacao','explicando',
    'ensina','ensine','ensinar','ensinando',
    'ensino',
    // Detalhar
    'detalha','detalhe','detalhar','detalhando','detalhamento',
    'aprofunda','aprofunde','aprofundar','aprofundando',
    'desenvolve','desenvolva','desenvolver','desenvolvimento',
    'elabora','elabore','elaborar','elaborando',
    'expande','expanda','expandir','expandindo',
    // Mostrar / apresentar
    'mostra','mostre','mostrar','mostrando',
    'apresenta','apresente','apresentar','apresentando',
    'exibe','exiba','exibir','exibindo',
    // Falar / dizer
    'fala','fale','falar','falando',
    'diz','diga','dizer','dizendo',
    'conta','conte','contar','contando',
    'comenta','comente','comentar','comentando',
    'menciona','mencione','mencionar','mencionando',
    // Descrever
    'descreve','descreva','descrever','descrevendo','descricao',
    'disserta','disserte','dissertar','dissertando',
    'aborda','aborde','abordar','abordando',
    // Definir / conceituar
    'define','defina','definir','definindo','definicao',
    'conceitua','conceitue','conceituar','conceituando','conceito',
    'caracteriza','caracterize','caracterizar','caracterizando','caracterizacao',
    'nomeia','nomeie','nomear','nomeando',
    'classifica','classifique','classificar','classificando','classificacao',
    'identifica','identifique','identificar','identificando','identificacao',
    // Listar / enumerar
    'lista','liste','listar','listando',
    'enumera','enumere','enumerar','enumerando','enumeracao',
    'cita','cite','citar','citando',
    'apresenta','aponta','aponte','apontar','apontando',
    // Resumir / sintetizar (ver também PALAVRAS_RESUMO)
    'resume','resuma','resumir','resumindo',
    'sintetiza','sintetize','sintetizar','sintetizando','sintese',
    'simplifica','simplifique','simplificar','simplificando',
    'condensar','condensa','condense','condensando',
    'sumariza','sumarize','sumarizar','sumarizando','sumarizacao',
    // Comparar / relacionar
    'compara','compare','comparar','comparando','comparacao',
    'relaciona','relacione','relacionar','relacionando','relacao',
    'diferencia','diferencie','diferenciar','diferenciando','diferenciacao',
    'distingue','distinga','distinguir','distinguindo','distincao',
    'contrasta','contraste','contrastar','contrastando',
    // Exemplificar
    'exemplifica','exemplifique','exemplificar','exemplificando',
    'ilustra','ilustre','ilustrar','ilustrando',
    'demonstra','demonstre','demonstrar','demonstrando','demonstracao',
    // Aplicar / usar
    'aplica','aplique','aplicar','aplicando','aplicacao',
    'usa','use','usar','usando','utilizacao',
    'utiliza','utilize','utilizar','utilizando',
    // Resolver / calcular
    'resolve','resolva','resolver','resolvendo','resolucao',
    'calcula','calcule','calcular','calculando','calculo',
    'determina','determine','determinar','determinando',
    'encontra','encontre','encontrar','encontrando',
    // Analisar / avaliar
    'analisa','analise','analisar','analisando','analise',
    'avalia','avalie','avaliar','avaliando','avaliacao',
    'interpreta','interprete','interpretar','interpretando','interpretacao',
    'critica','critique','criticar','criticando','critica',
    'julga','julgue','julgar','julgando','julgamento',
    // Ajudar / corrigir
    'ajuda','ajude','ajudar','ajudando',
    'corrige','corrija','corrigir','corrigindo','correcao',
    'revisa','revise','revisar','revisando','revisao',
    'verifica','verifique','verificar','verificando','verificacao',
  ]);

  /* ── 3.3  PALAVRAS DE EXPLICAÇÃO ─────────────────────────────────────
     Indicadores de que o usuário quer entender um conceito,
     não apenas saber a resposta correta.
  ──────────────────────────────────────────────────────────────────── */

  const PALAVRAS_EXPLICACAO = new Set([
    // Substantivos de entendimento
    'explicacao','explicacoes','explicando',
    'conceito','conceitos','conceituacao',
    'definicao','definicoes',
    'descricao','descricoes',
    'entendimento','compreensao','compreendendo',
    'teoria','teorias','teorico','teorica',
    'fundamento','fundamentos','base','bases','principio','principios',
    'logica','raciocinio','raciocinar',
    'funcionamento','funciona','funcionar',
    'significado','significados','significa','significar',
    'sentido','contexto','contextualizacao',
    // Expressões interrogativas de entendimento
    'por que','porque','pq','pk','porq','por qual motivo','por qual razao',
    'como funciona','como e que','de que forma','de que maneira','de que modo',
    'o que e','o que sao','o que seria','o que seria isso',
    'qual e a diferenca','qual seria','qual a relacao','qual o significado',
    'quando acontece','em que situacao','em que contexto',
    'quem criou','quem desenvolveu','quem propôs',
    'onde se aplica','onde e usado','onde aparece',
    // Expressões de dificuldade que indicam pedido de explicação
    'nao entendi','nao entendo','nao to entendendo','nao estou entendendo',
    'nao compreendi','nao compreendo','nao to compreendendo',
    'nao sei o que e','nao sei o que sao',
    'me perdeu','me perdi','me confundiu','fiquei confuso','fiquei confusa',
    'pode me explicar','pode explicar','pode me falar','pode falar',
    'pode detalhar','pode aprofundar','pode desenvolver',
    'me faz entender','me ajuda a entender','me ajuda a compreender',
    'como assim','tipo como assim','como que e isso','que e isso',
    'que conceito e esse','que ideia e essa',
    // Marcadores de profundidade
    'mais detalhado','mais detalhada','com mais detalhes',
    'com mais profundidade','em mais profundidade',
    'de forma completa','de modo completo','completo','completa',
    'passo a passo','do inicio','do zero','desde o inicio',
    'tudo sobre','tudo a respeito',
  ]);

  /* ── 3.4  PALAVRAS DE RESUMO ─────────────────────────────────────────
     Indicadores de que o usuário quer uma versão condensada ou síntese.
  ──────────────────────────────────────────────────────────────────── */

  const PALAVRAS_RESUMO = new Set([
    // Verbos e derivados de resumir
    'resume','resuma','resumir','resumindo','resumo',
    'resumao','resuminho','resumido','resumida',
    'sintetiza','sintetize','sintetizar','sintetizando','sintese',
    'simplifica','simplifique','simplificar','simplificando','simplificado',
    'condensa','condense','condensar','condensando','condensado',
    'sumariza','sumarize','sumarizar','sumarizando','sumarizacao',
    // Expressões de síntese
    'em resumo','de forma resumida','de modo resumido',
    'de forma sintetica','de modo sintetico','sinteticamente',
    'resumidamente','brevemente','sucintamente',
    'em poucas palavras','em poucas linhas','em poucas frases',
    'em linhas gerais','de forma geral','de modo geral','no geral',
    'em suma','em geral','em termos gerais',
    'versao curta','versao resumida','versao simplificada',
    'versao enxuta','versao compacta',
    // Pedidos de rapidez / brevidade
    'rapido','rapida','rapidinho','rapidamente',
    'curto','curta','curtinho','curtamente',
    'breve','brevemente','de forma breve',
    'objetivo','objetiva','de forma objetiva','de modo objetivo',
    'direto','direta','direto ao ponto','vai direto',
    'so o principal','so o essencial','so o importante',
    'o que importa','o mais importante','o essencial',
    'so o necessario','sem enrolacao','sem rodeios',
    // Substantivos de síntese
    'sintese','sumario','resumo','sinopse',
    'overview','visao geral','panorama','esboço','esboco',
    'esquema','esquematizar','mapa','mapa mental',
    'topicos','topico','pontos principais','pontos chave',
    'ideias principais','ideia principal','ideia central',
    'palavras chave','palavras principais',
  ]);

  /* ── 3.5  PALAVRAS DE GABARITO ───────────────────────────────────────
     Indicadores de que o usuário quer saber a resposta correta de uma
     questão — e NÃO uma explicação do tema.
  ──────────────────────────────────────────────────────────────────── */

  const PALAVRAS_GABARITO = new Set([
    // Gabarito / resposta certa
    'gabarito','gabaritos',
    'resposta correta','resposta certa',
    'respostas corretas','respostas certas',
    'alternativa correta','alternativa certa',
    'alternativas corretas','alternativas certas',
    'opcao correta','opcao certa',
    'opcoes corretas','opcoes certas',
    'letra correta','letra certa',
    // Pedidos diretos de resposta
    'qual e a resposta','qual a resposta','qual seria a resposta',
    'qual e a correta','qual a correta','qual e a certa','qual a certa',
    'qual a alternativa','qual e a alternativa','qual seria a alternativa',
    'qual a letra','qual e a letra','qual seria a letra',
    'qual e o gabarito','qual o gabarito','qual seria o gabarito',
    'me da a resposta','me da o gabarito','me da a correta',
    'me passa a resposta','me passa o gabarito','me passa a correta',
    'me fala a resposta','me fala o gabarito','me fala a correta',
    'me diz a resposta','me diz o gabarito','me diz a correta',
    'qual marcar','o que marcar','o que assinalar',
    'o que responder','como responder',
    // Confirmação de alternativa específica
    'e a a','e a b','e a c','e a d','e a e',
    'seria a','seria o','seria b','seria c','seria d','seria e',
    'letra a','letra b','letra c','letra d','letra e',
    // Resolução
    'resolucao','resolucoes','resolve a','resolveu a',
    'solucao','solucoes','solucao correta',
    'como resolver','como se resolve','como se calcula',
    // Marcação
    'marca','marcar','marcaria','marcar qual',
    'assinala','assinalar','assinalaria',
    'escolhe','escolher','escolheria','qual escolher',
    'seleciona','selecionar','selecionaria',
    // Certo / errado sobre alternativa específica
    'ta certo','ta errado','esta certo','esta errado',
    'isso esta certo','isso ta errado','essa e certa','essa e errada',
    'essa alternativa e certa','essa alternativa ta certa',
    'confirma','confirmar','confirmacao',
  ]);

  /* ── 3.6  PALAVRAS DE REFERÊNCIA A QUIZ ─────────────────────────────
     Termos que remetem a questões, alternativas e estrutura de quiz.
  ──────────────────────────────────────────────────────────────────── */

  const PALAVRAS_REFERENCIA_QUIZ = new Set([
    // Questão
    'questao','questoes','questoezinha','questoezao',
    'pergunta','perguntas',
    'exercicio','exercicios','exerc',
    'item','itens',
    'enunciado','enunciados',
    'problema','problemas',
    'q','q1','q2','q3','q4','q5','q6','q7','q8','q9','q10',
    // Alternativa
    'alternativa','alternativas','alt',
    'opcao','opcoes','opção',
    'letra','letras',
    'item a','item b','item c','item d','item e',
    'a)','b)','c)','d)','e)',
    'alternativa a','alternativa b','alternativa c','alternativa d','alternativa e',
    // Numeração de questão
    'numero','numeros','numero da questao',
    'primeira questao','segunda questao','terceira questao',
    'questao 1','questao 2','questao 3','questao 4','questao 5',
    'questao 6','questao 7','questao 8','questao 9','questao 10',
    'numero 1','numero 2','numero 3','numero 4','numero 5',
    'a primeira','a segunda','a terceira','a quarta','a quinta',
    // Quiz em si
    'quiz','quizzes','prova','provas','teste','testes','simulado','simulados',
    'avaliacao','avaliacoes','ap1','ap2','ap3','av1','av2','av3',
    'exame','exames','lista','listas','lista de exercicios',
    // Acerto / erro
    'acertei','errei','acerto','erro','erros','acertos',
    'certo','errado','correto','incorreto',
    'na vei','errando','acertando',
    // Pontuação / resultado
    'pontuacao','nota','notas','resultado','resultados',
    'desempenho','placar',
  ]);

  /* ── 3.7  PALAVRAS DE REFERÊNCIA A RESUMO ───────────────────────────
     Termos que remetem ao conteúdo teórico, aulas e material de estudo.
  ──────────────────────────────────────────────────────────────────── */

  const PALAVRAS_REFERENCIA_RESUMO = new Set([
    // Estrutura de conteúdo
    'aula','aulas','licao','licoes','modulo','modulos',
    'capitulo','capitulos','topico','topicos',
    'secao','secoes','parte','partes',
    'tema','temas','assunto','assuntos',
    'conteudo','conteudos','materia','materias',
    'disciplina','disciplinas',
    // Material
    'resumo','resumos','nota','notas','anotacao','anotacoes',
    'apostila','apostilas','slide','slides','material',
    'texto','textos','leitura','leituras',
    // Teoria / conceito
    'teoria','teorias','teorico','teorica',
    'conceito','conceitos','definicao','definicoes',
    'principio','principios','fundamento','fundamentos',
    'base','bases','noção','nocao','nocoes',
    'ideia','ideias','ideia central','ideia principal',
    // Contexto de revisão
    'revisao','revisoes','revisar','estudando','estudar','estudo',
    'aprender','aprendendo','aprendizagem',
    'deu na prova','cai na prova','pode cair','costuma cair',
    'importante','mais importante','mais cobrado',
    'ponto chave','pontos chave','palavra chave','palavras chave',
    // Localização no conteúdo
    'onde fala','onde aparece','onde esta','onde fica',
    'em que aula','em que parte','em que topico',
    'sobre o que e','qual e o assunto','qual o tema',
  ]);

  /* ── 3.8  SAUDAÇÕES ──────────────────────────────────────────────────
     Cumprimentos, aberturas e fechamentos de conversa.
     Útil para detectar quando o usuário está apenas iniciando uma
     interação sem uma pergunta real.
  ──────────────────────────────────────────────────────────────────── */

  const SAUDACOES = new Set([
    // Cumprimentos
    'oi','oia','oie',
    'ola','olá',
    'opa','opaaa','opaaa',
    'hey','heey','heeey',
    'hi','hello',
    'eai','e ai','e aí','eaí','eai e',
    'salve','salve salve',
    'fala','fala ae','fala ai','fala tu',
    'oie','oiee','oooi',
    'oi oi','oi tudo bem',
    'tudo','tudo bem','tudo bom','tudo certo','tudo ok','tudo otimo',
    'como vai','como voce vai','como vc vai','tudo beleza',
    // Períodos do dia
    'bom dia','boa tarde','boa noite',
    'boa manha',
    // Despedidas
    'tchau','xau','xau xau','tchau tchau',
    'ate','ate mais','ate logo','ate depois','ate amanha',
    'falou','falou e ouvi','fui','tah indo','ta indo',
    'obrigado','obrigada','valeu','vlw','vlew','vlws',
    'tmj','tmjjj',
    // Agradecimentos simples
    'obg','obgr','obgdd','mt obg','muito obrigado','muito obrigada',
    'agradecido','agradecida','agradeco',
    'legal','que legal','otimo','perfeito','show','show de bola',
  ]);

  /* ── 3.9  CONFIRMAÇÕES ───────────────────────────────────────────────
     Expressões de concordância, aprovação ou "sim".
  ──────────────────────────────────────────────────────────────────── */

  const CONFIRMACOES = new Set([
    // Sim direto
    'sim','s','ss','sss',
    'isso','isso mesmo','isso ai','isso aí','exatamente isso',
    'exato','exata','exatamente',
    'correto','correta','correto isso',
    'certo','certa','certinho','certinha',
    'verdade','verdadeiro','verdadeira',
    'com certeza','claro','claro que sim','com toda certeza',
    'sem duvida','sem sombra de duvida',
    // Gírias de confirmação
    'beleza','blz','blza',
    'ok','okay','okk','okkk',
    'fechou','fechado',
    'perfeito','perfeito mesmo',
    'top','topzera','topzin',
    'show','show de bola','showzim','showzera',
    'massa','da hora','tri','irado','irado mesmo',
    'pode ser','pode','po','pow',
    'uhum','uhu','ahã','aha','aham',
    'yes','yep','yap','yeah',
    'ta bom','ta bem','tah bom','ta','tá',
    'combinado','combinei','firmeza','firme',
    'entendido','entendi','captei','sacou',
    'ta certo','ta correto','confirmo','confirmado',
  ]);

  /* ── 3.10  NEGAÇÕES ──────────────────────────────────────────────────
     Expressões de discordância, negação ou "não".
  ──────────────────────────────────────────────────────────────────── */

  const NEGACOES = new Set([
    // Não direto
    'nao','n','nn','nnn',
    'nope','nop','no',
    'negativo','negativo mesmo',
    'claro que nao','de jeito nenhum','de forma alguma',
    'jamais','nunca','em hipotese alguma',
    'impossivel','impossivel isso',
    // Discordância
    'errado','errada','erradissimo','erradissima',
    'incorreto','incorreta',
    'falso','falsa',
    'engano','enganado','enganada',
    'nao e isso','nao e bem assim','nao e bem esse',
    'discordo','discordei','nao concordo',
    'nao acho','acho que nao','me parece que nao',
    // Rejeição
    'nao quero','nao preciso','nao e isso','nao e o que eu quis dizer',
    'deixa pra la','esquece','esquece isso',
    'nao foi isso','nao pedi isso','nao era isso',
  ]);

  /* ── 3.11  PALAVRAS DE DÚVIDA ────────────────────────────────────────
     Expressões que indicam que o usuário está confuso ou inseguro.
     Útil para ajustar tom e profundidade da resposta.
  ──────────────────────────────────────────────────────────────────── */

  const PALAVRAS_DUVIDA = new Set([
    // Confusão direta
    'confuso','confusa','confundido','confundida',
    'perdido','perdida','me perdi','me perdeu','me confundiu',
    'travei','emperrei','traiei','traí',
    'nao entendi','nao entendo','nao to entendendo','nao estou entendendo',
    'nao compreendi','nao compreendo',
    'nao sei','sei la','sei la nao','sei nao',
    'nao faço ideia','nao faco ideia','nenhuma ideia','zero ideia',
    'ta dificil','esta dificil','e dificil','muito dificil',
    'nao to conseguindo','nao to pegando','nao to sacando',
    'nao caiu','nao caiu o ficha','nao caiu na minha cabeca',
    'bate a cabeca','batendo cabeca','quebra cabeca',
    // Dúvida sobre o conteúdo
    'tenho duvida','tenho duvidas','com duvida','com duvidas',
    'duvida','duvidas','duvidar',
    'nao tenho certeza','nao sei ao certo','incerto','incerta',
    'nao tenho muita certeza','tenho quase certeza mas',
    'sera que','nao seria','nao seria que',
    'isso mesmo','e isso mesmo','será que e','nao sei se e',
    // Pedido de esclarecimento
    'esclarece','esclareça','esclarecer','esclarecimento','esclarecimentos',
    'tira a duvida','tira minhas duvidas',
    'me esclarece','me esclareça','pode esclarecer',
    'nao ficou claro','nao ficou muito claro',
    'ficou vago','ficou confuso','ficou sem sentido',
    'pode ser mais claro','pode explicar melhor','explica melhor',
    'pode simplificar','de um jeito mais facil',
    'de outro jeito','de outra forma','de outro modo',
    'em outras palavras','ou seja','ou seja como assim',
    // Insegurança em prova/quiz
    'nao sei qual marcar','nao sei o que marcar','nao sei qual escolher',
    'nao sei qual e','nao sei qual seria',
    'to em duvida entre','entre a e b','entre b e c','entre c e d',
    'to oscilando entre','nao sei se e a ou b',
    'qual dos dois','qual das duas','qual das tres',
    // Expressões afetivas de dificuldade
    'que dificil','que pesado','que complicado','que saco','que paia',
    'socorro','me ajuda','me salvaa','me salva','me vale',
    'to lascado','to ferrado','ta tenso',
    'nao aguento','nao to aguentando','to sofrendo',
    'que materia dificil','que assunto pesado',
  ]);

  /* ── 3.12  PALAVRAS DE CONTINUIDADE ─────────────────────────────────
     Pronomes, expressões demonstrativas e anafóricas que indicam
     referência a algo dito anteriormente. Usadas para detectar
     perguntas de seguimento (follow-up).
  ──────────────────────────────────────────────────────────────────── */

  const PALAVRAS_CONTINUIDADE = new Set([
    // Demonstrativos referenciais
    'esse','essa','esses','essas',
    'este','esta','estes','estas',
    'aquele','aquela','aqueles','aquelas',
    'isso','isto','aquilo',
    'ele','ela','eles','elas',
    // Expressões de referência ao conteúdo anterior
    'isso que voce disse','o que voce falou','o que vc falou',
    'o que acabou de falar','o que acabou de dizer',
    'esse tema','esse assunto','esse conceito','essa ideia',
    'esse topico','essa parte','essa secao','essa aula',
    'esse ponto','esse item','esse trecho',
    // Referência à questão anterior
    'essa questao','essa pergunta','esse exercicio','esse item',
    'essa alternativa','essa resposta','essa opcao','essa letra',
    'a questao anterior','a anterior','a que voce mostrou',
    'a ultima questao','a ultima pergunta','a ultima alternativa',
    'a proxima questao','a proxima pergunta','a proxima alternativa',
    'a seguinte','o seguinte','o proximo',
    // Pedidos de continuação
    'e a b','e a c','e a d','e a e',
    'e a alternativa a','e a alternativa b','e a alternativa c',
    'e a opcao a','e a opcao b','e a opcao c',
    'e o a','e o b','e o c','e o d',
    'e as outras','e os outros','e as demais','e os demais',
    'e o resto','e o restante','e as outras alternativas',
    // Continuação narrativa
    'continua','continue','continuando','seguindo','seguindo isso',
    'alem disso','alem','e mais','mais sobre isso',
    'sobre o mesmo tema','sobre o mesmo assunto','sobre isso',
    'relacionado a isso','relacionado com isso','nesse contexto',
    'nessa linha','nessa mesma linha','dentro desse tema',
    'aprofundando nisso','aprofundando esse tema',
    // Anáfora de número de questão
    'a 1','a 2','a 3','a 4','a 5','a 6','a 7','a 8','a 9','a 10',
    'da 1','da 2','da 3','da 4','da 5','da 6','da 7','da 8','da 9','da 10',
    'numero 1','numero 2','numero 3','numero 4','numero 5',
  ]);

  /* ── 3.13  PALAVRAS DE URGÊNCIA ──────────────────────────────────────
     Expressões que indicam pressa ou pedido de brevidade.
  ──────────────────────────────────────────────────────────────────── */

  const PALAVRAS_URGENCIA = new Set([
    'rapido','rapida','rapidinho','rapidinha','rapidamente',
    'rapido por favor','bem rapido','de forma rapida',
    'urgente','urgentemente','e urgente',
    'logo','logo logo','ja','ja ja',
    'pressa','com pressa','de pressa',
    'tempo curto','pouco tempo','sem tempo',
    'to com pressa','ta com pressa','tenho pressa',
    'sem enrolacao','sem rodeios','sem delongas','direto ao ponto',
    'vai direto','vai direto ao ponto','vai la direto',
    'so o basico','so o essencial','so o principal','so o necessario',
    'de forma resumida','na moral','na moral rapido',
    'curto','curtinho','curto e grosso','curto e bom',
    'em 30 segundos','em 1 minuto','em dois minutos',
    'por cima','por cima so','por cima mesmo','superficialmente',
    'overview rapido','visao rapida','visao geral rapida',
    'em resumo','resumindo','pra resumir',
    'so o tl dr','tl dr','tldr',
  ]);

  /* ── 3.14  EXPRESSÕES AFETIVAS ───────────────────────────────────────
     Gírias, interjeições e linguagem emocional sem valor semântico
     de conteúdo. Útil para limpeza e detecção de contexto emocional.
  ──────────────────────────────────────────────────────────────────── */

  const EXPRESSOES_AFETIVAS = new Set([
    // Interjeições de surpresa / reação
    'puts','putz','poxa','poxinha',
    'caramba','carambaaa','caraai','cara',
    'nossa','nossaaaa','nossa senhora',
    'eita','eitaaaa','eita que coisa',
    'uai','tsc','chi','xi','xiiii',
    'que','que isso','que e isso','que foi',
    'wow','wooow','uau','uauuu',
    'incrivel','que incrivel','que demais','que top',
    // Riso
    'kkk','kkkk','kkkkk','kkkkkk',
    'kk','kkkjjj','kkjjj','kkjj','kkjjjj',
    'haha','hahaha','hahahaha',
    'rsrs','rsrsrs','rsrsrsrs',
    'lol','lolol','lmao','omg',
    'hehe','hehehe','hihi',
    // Expressões de alívio / euforia
    'aeee','aeeee','aeeeee','que alivio',
    'ueee','ueeee','yes','yeees','yesss',
    'ebaaa','ebaaaaaa','otimo','que bom',
    // Expressões de frustração
    'droga','drogaaa','ah nao','ahh nao','que chato',
    'que saco','que paia','que paizao',
    'que raiva','que merda','que pena',
    'ai ai','aiaiai','puts vida',
    'nao acredito','impossivel','serio',
    'to lascado','to ferrado','ta ruim',
    // Vocativos e apelidos
    'mano','manoo','manooo',
    'mana','manaaa',
    'brother','bro','brooo',
    'man','mannn',
    'vei','véi','veio','velho','velha',
    'cara','caraaa',
    'carinha','caroca',
    'parceiro','parceira','parc',
    'amigo','amiga','ami',
    'fi','fii','fiii',
    'bi','bii','biii',
    // Reações positivas de aprendizado
    'entendi','agora entendi','ah entendi','ahh entendi',
    'fez sentido','agora fez sentido','agora ficou claro',
    'captei','sacou','sacei','sacar','sacando',
    'na vei que top','muito bom','muito boa','legal demais',
    'que explicacao boa','explica bem','boa explicacao',
  ]);

  /* ── 3.15  ABREVIAÇÕES DE CHAT ───────────────────────────────────────
     Abreviações comuns em mensagens de texto e chats de estudantes.
     Mapeadas para facilitar normalização/expansão quando necessário.
  ──────────────────────────────────────────────────────────────────── */

  const ABREVIACOES_CHAT = new Set([
    // Interrogativas
    'oq','oque','oqe','oq e','oqe e',
    'pq','porq','por q','pk','p q','p/q',
    'pq sim','pq nao','pq isso',
    'qdo','quando',
    'qts','quantos','qtas','quantas',
    'qm','quem','q tal',
    // Intensificadores
    'mt','mto','mta','mtas','mts',
    'td','tds','tudo','td bem',
    'q','qq','qlq','qual q',
    // Afirmações / negações abreviadas
    'blz','blza','blzza',
    'vlw','vlew','vlws',
    'tmj','tmjjj','tm',
    'tb','tbm','tmb',
    'vc','vcs','vce',
    'pra','pro','pras','pros',
    // Outros comuns
    'hj','hoje',
    'amh','amanha',
    'n','nao','nn',
    's','sim','ss',
    'c','com','cc',
    'q','que',
    'eh','e',
    'ta','estar','está',
    'to','estou','tou',
    'faz','fazendo','fzd','fznd',
    'rs','rsrs','kk','kkk',
    'flw','falou','fw',
    'qq','qualquer',
    'msg','mensagem','msgs',
    'fds','fim de semana',
    'obg','obrigado','obrigada',
    'pfv','por favor','pfvr','pf',
    'abs','abraco','abracos',
    'bjs','beijo','beijos',
  ]);

  /* ── 3.16  SINÔNIMOS ─────────────────────────────────────────────────
     Mapa de variações para forma canônica normalizada.
     Usado para expandir ou unificar termos antes da busca.
     Formato: { variacao: 'forma_canonica' }
     Todas as chaves e valores são normalizados (sem acento, minúsculas).
  ──────────────────────────────────────────────────────────────────── */

  const SINONIMOS = {
    // Explicação
    'explica':       'explicacao',
    'explicar':      'explicacao',
    'explicando':    'explicacao',
    'explique':      'explicacao',
    'explicita':     'explicacao',
    'esclarecer':    'explicacao',
    'esclarece':     'explicacao',
    'esclareca':     'explicacao',
    // Definição
    'define':        'definicao',
    'definir':       'definicao',
    'definindo':     'definicao',
    'defina':        'definicao',
    'conceito':      'definicao',
    'conceitua':     'definicao',
    'conceituar':    'definicao',
    // Resumo
    'resume':        'resumo',
    'resumir':       'resumo',
    'resumindo':     'resumo',
    'resuma':        'resumo',
    'resumao':       'resumo',
    'sintese':       'resumo',
    'sintetiza':     'resumo',
    'sintetizar':    'resumo',
    // Gabarito
    'gabarito':      'resposta_correta',
    'resposta certa':'resposta_correta',
    'alternativa correta':'resposta_correta',
    'letra correta': 'resposta_correta',
    'correta':       'resposta_correta',
    'resolucao':     'resposta_correta',
    'solucao':       'resposta_correta',
    // Questão
    'questao':       'questao',
    'pergunta':      'questao',
    'exercicio':     'questao',
    'problema':      'questao',
    'item':          'questao',
    'q':             'questao',
    // Aula / conteúdo
    'aula':          'conteudo',
    'topico':        'conteudo',
    'capitulo':      'conteudo',
    'materia':       'conteudo',
    'assunto':       'conteudo',
    'modulo':        'conteudo',
    // Entender
    'entender':      'compreender',
    'entendo':       'compreender',
    'entendi':       'compreender',
    'captar':        'compreender',
    'captar':        'compreender',
    'pegar':         'compreender',
    'sacar':         'compreender',
    // Mostrar
    'mostra':        'mostrar',
    'mostre':        'mostrar',
    'apresenta':     'mostrar',
    'apresente':     'mostrar',
    'exibe':         'mostrar',
  };

  /* ════════════════════════════════════════════════════════════════════════
     § 4  STOPWORDS — filtro
  ════════════════════════════════════════════════════════════════════════ */

  /**
   * Remove stopwords de uma lista de termos.
   * Se todos forem stopwords, retorna a lista original para não esvaziar a query.
   *
   * @param {string[]} termos
   * @returns {string[]}
   */
  function filtrarStopwords(termos) {
    const filtrados = termos.filter(function (t) { return !STOPWORDS.has(t); });
    return filtrados.length > 0 ? filtrados : termos;
  }

  /* ════════════════════════════════════════════════════════════════════════
     § 5  SCORE
  ════════════════════════════════════════════════════════════════════════ */

  /**
   * Calcula score de relevância entre query e entrada do índice.
   *
   * @param {string} queryNorm   — query normalizada
   * @param {string} textoNorm   — texto da entrada normalizado
   * @param {string} stemsTexto  — stems do texto da entrada
   * @param {number} peso        — peso da entrada (ex: 1.5 para ideia central)
   * @returns {number} 0–100
   */
  function score(queryNorm, textoNorm, stemsTexto, peso) {
    if (!queryNorm || !textoNorm) return 0;

    const todosTermos = queryNorm.split(' ').filter(Boolean);
    if (!todosTermos.length) return 0;

    const termos = filtrarStopwords(todosTermos);

    var acertos = 0;
    termos.forEach(function (t) {
      var stemT = stem(t);
      if (textoNorm.includes(t) || stemsTexto.includes(stemT)) {
        acertos++;
      }
    });

    const cobertura = acertos / termos.length;
    const stemQuery = termos.map(stem).join(' ');
    const bonus     = (textoNorm.includes(queryNorm) || stemsTexto.includes(stemQuery)) ? 0.3 : 0;

    var scoreBase = Math.min(100, Math.round((cobertura + bonus) * peso * 100));

    if (termos.length === 1 && acertos === 1 && scoreBase < 60) {
      scoreBase = Math.round(60 * peso);
    }

    return scoreBase;
  }

  /* ════════════════════════════════════════════════════════════════════════
     § 6  PREPARAÇÃO DE ENTRADA DE ÍNDICE
  ════════════════════════════════════════════════════════════════════════ */

  /**
   * Prepara um objeto de entrada para inserção num índice de busca.
   * Pré-computa textoNorm e stemsTexto para evitar recalcular a cada busca.
   *
   * @param {string} texto
   * @param {string} aula
   * @param {string} secao
   * @param {number} peso
   * @returns {{ texto, aula, secao, peso, textoNorm, stemsTexto }}
   */
  function prepararEntrada(texto, aula, secao, peso) {
    var tn       = normalizarTexto(texto);
    var palavras = tn.split(' ').filter(Boolean);
    return {
      texto:      texto,
      aula:       aula,
      secao:      secao,
      peso:       peso,
      textoNorm:  tn,
      stemsTexto: palavras.map(stem).join(' '),
    };
  }

  /* ════════════════════════════════════════════════════════════════════════
     § 7  UTILITÁRIOS DE DETECÇÃO DE INTENÇÃO
  ════════════════════════════════════════════════════════════════════════ */

  /**
   * Verifica se o texto normalizado contém ao menos um termo de um Set.
   *
   * Realiza correspondência por palavra inteira (word-boundary) para evitar
   * falsos positivos (ex: "essa" dentro de "essa questão" não deve bater
   * como palavra isolada em "essas").
   *
   * @param {string}  textoNorm  — texto já normalizado via normalizarTexto()
   * @param {Set}     conjunto   — um dos conjuntos semânticos acima
   * @returns {boolean}
   */
  function contemAlgum(textoNorm, conjunto) {
    if (!textoNorm || !conjunto || !conjunto.size) return false;
    // Divide em tokens e verifica existência no Set — O(n) mas Sets são O(1)
    var tokens = textoNorm.split(' ').filter(Boolean);
    for (var i = 0; i < tokens.length; i++) {
      if (conjunto.has(tokens[i])) return true;
    }
    // Verifica também substrings de 2 tokens (bigramas) para expressões como
    // "por que", "bom dia", "e ai", "tudo bem", etc.
    for (var j = 0; j < tokens.length - 1; j++) {
      if (conjunto.has(tokens[j] + ' ' + tokens[j + 1])) return true;
    }
    // Trigramas para expressões de 3 palavras como "e a resposta", "qual a letra"
    for (var k = 0; k < tokens.length - 2; k++) {
      if (conjunto.has(tokens[k] + ' ' + tokens[k + 1] + ' ' + tokens[k + 2])) return true;
    }
    return false;
  }

  /**
   * Detecta a intenção principal de um texto normalizado.
   *
   * Retorna um objeto com flags booleanas para cada intenção detectada.
   * Múltiplas flags podem ser true ao mesmo tempo — a prioridade é do
   * consumidor (quiz/assistant.js, resumo/assistant.js).
   *
   * @param {string} textoNorm — texto já normalizado via normalizarTexto()
   * @returns {{
   *   saudacao:     boolean,
   *   gabarito:     boolean,
   *   explicacao:   boolean,
   *   resumo:       boolean,
   *   duvida:       boolean,
   *   continuidade: boolean,
   *   confirmacao:  boolean,
   *   negacao:      boolean,
   *   urgencia:     boolean,
   *   quizRef:      boolean,
   *   resumoRef:    boolean,
   * }}
   */
  function detectarIntencao(textoNorm) {
    return {
      saudacao:     contemAlgum(textoNorm, SAUDACOES),
      gabarito:     contemAlgum(textoNorm, PALAVRAS_GABARITO),
      explicacao:   contemAlgum(textoNorm, PALAVRAS_EXPLICACAO),
      resumo:       contemAlgum(textoNorm, PALAVRAS_RESUMO),
      duvida:       contemAlgum(textoNorm, PALAVRAS_DUVIDA),
      continuidade: contemAlgum(textoNorm, PALAVRAS_CONTINUIDADE),
      confirmacao:  contemAlgum(textoNorm, CONFIRMACOES),
      negacao:      contemAlgum(textoNorm, NEGACOES),
      urgencia:     contemAlgum(textoNorm, PALAVRAS_URGENCIA),
      quizRef:      contemAlgum(textoNorm, PALAVRAS_REFERENCIA_QUIZ),
      resumoRef:    contemAlgum(textoNorm, PALAVRAS_REFERENCIA_RESUMO),
    };
  }

  /**
   * Expande abreviações de chat para a forma mais longa.
   * Útil como pré-processamento antes de normalizarTexto() em alguns contextos.
   *
   * Atenção: aplica substituições simples de token — não é um parser semântico.
   * Retorna o texto com espaços normalizados.
   *
   * @param {string} texto — texto bruto (pode ter acentos/maiúsculas)
   * @returns {string}
   */
  function expandirAbreviacoes(texto) {
    if (typeof texto !== 'string') return '';

    // Mapa de expansão: abreviação normalizada → forma expandida normalizada
    var expansao = {
      'pq':   'porque',
      'porq': 'porque',
      'pk':   'porque',
      'oq':   'o que',
      'oque': 'o que',
      'oqe':  'o que',
      'vc':   'voce',
      'vcs':  'voces',
      'pra':  'para',
      'pro':  'para o',
      'tb':   'tambem',
      'tbm':  'tambem',
      'tmb':  'tambem',
      'mt':   'muito',
      'mto':  'muito',
      'td':   'tudo',
      'tds':  'todos',
      'n':    'nao',
      'nn':   'nao',
      'blz':  'beleza',
      'vlw':  'valeu',
      'tmj':  'tamo junto',
      'obg':  'obrigado',
      'pfv':  'por favor',
      'hj':   'hoje',
      'amh':  'amanha',
      'flw':  'falou',
      'qq':   'qualquer',
      'qlq':  'qualquer',
      'msg':  'mensagem',
      'fds':  'fim de semana',
    };

    var tokens = normalizarTexto(texto).split(' ');
    var expandidos = tokens.map(function (t) {
      return expansao[t] || t;
    });
    return expandidos.join(' ').replace(/\s+/g, ' ').trim();
  }

  /* ════════════════════════════════════════════════════════════════════════
     § 8  REGISTRO GLOBAL
  ════════════════════════════════════════════════════════════════════════ */

  window.NexusTextUtils = {
    // ── Funções principais (contrato imutável com os demais módulos) ───
    normalizarTexto,
    stem,
    filtrarStopwords,
    score,
    prepararEntrada,

    // ── Vocabulário semântico ─────────────────────────────────────────
    STOPWORDS,
    VERBOS_INTENCAO,
    PALAVRAS_EXPLICACAO,
    PALAVRAS_RESUMO,
    PALAVRAS_GABARITO,
    PALAVRAS_REFERENCIA_QUIZ,
    PALAVRAS_REFERENCIA_RESUMO,
    SAUDACOES,
    CONFIRMACOES,
    NEGACOES,
    PALAVRAS_DUVIDA,
    PALAVRAS_CONTINUIDADE,
    PALAVRAS_URGENCIA,
    EXPRESSOES_AFETIVAS,
    ABREVIACOES_CHAT,
    SINONIMOS,

    // ── Utilitários de intenção ───────────────────────────────────────
    contemAlgum,
    detectarIntencao,
    expandirAbreviacoes,
  };

}());