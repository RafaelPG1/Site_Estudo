/* CONTEÚDO DE TESTE — NÃO OFICIAL. Serve só para validar o carregamento e a jogabilidade da estrutura
   content/games/<jogo>/<semestre>/<avaliação>/. Não use para estudar para a prova; substitua pelo conteúdo real. */
export const CONTEUDO_TESTE = true;

const _CARDS_POR_SEMESTRE = {
  '2026.2': {
    analise_projeto: [
      { id: 'teste_fc_1', frente: '[TESTE] O que é um requisito funcional?', verso: 'Algo que o sistema <strong>deve fazer</strong>.', dica: 'Funcionalidade' },
      { id: 'teste_fc_2', frente: '[TESTE] O que é um requisito não funcional?', verso: 'Uma <strong>qualidade ou restrição</strong> do sistema (desempenho, segurança…).', dica: 'Qualidade' },
      { id: 'teste_fc_3', frente: '[TESTE] Para que serve o diagrama de casos de uso?', verso: 'Mostra <strong>atores</strong> e as <strong>funcionalidades</strong> do sistema.', dica: 'Atores + funções' },
      { id: 'teste_fc_4', frente: '[TESTE] Para que serve o diagrama de classes?', verso: 'Mostra a <strong>estrutura</strong>: classes, atributos, métodos e relacionamentos.', dica: 'Estrutura' },
    ],
  },
};

export function getCardsData(semestre) {
  return _CARDS_POR_SEMESTRE[semestre] ?? {};
}
