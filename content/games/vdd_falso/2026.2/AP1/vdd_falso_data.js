/* CONTEÚDO DE TESTE — NÃO OFICIAL. Serve só para validar o carregamento e a jogabilidade da estrutura
   content/games/<jogo>/<semestre>/<avaliação>/. Não use para estudar para a prova; substitua pelo conteúdo real. */
export const CONTEUDO_TESTE = true;

export const VDD_FALSO_DATA = {
  '2026.2': {
    analise_projeto: [
      { id: 'teste_vf_1', aula: 1, enunciado: '[TESTE] Um requisito funcional descreve algo que o sistema deve fazer.', resposta: true,
        explicacao: '[TESTE] Requisitos funcionais descrevem funcionalidades; os não funcionais descrevem qualidades e restrições.' },
      { id: 'teste_vf_2', aula: 1, enunciado: '[TESTE] O diagrama de casos de uso mostra a estrutura interna das classes.', resposta: false,
        explicacao: '[TESTE] Quem mostra a estrutura das classes é o diagrama de classes; casos de uso mostram atores e funcionalidades.' },
      { id: 'teste_vf_3', aula: 1, enunciado: '[TESTE] O levantamento de requisitos pode ser feito por entrevistas com os usuários.', resposta: true,
        explicacao: '[TESTE] Entrevistas, questionários e observação são técnicas comuns de levantamento.' },
      { id: 'teste_vf_4', aula: 1, enunciado: '[TESTE] Requisitos nunca mudam depois de aprovados.', resposta: false,
        explicacao: '[TESTE] Requisitos evoluem; por isso existe a gestão de mudanças.' },
    ],
  },
};
