/* =============================================
   NEXUS STUDY — checklist/checklist_data.js
   Conteúdo pré-definido do Checklist por semestre e disciplina.

   ► Estrutura: CHECKLIST_ITENS[semestre][discId]
   ► O semestre deve ser igual ao definido em global.js (ex: '2026.1')
   ► O discId deve ser igual ao id em _DISCIPLINAS do global.js
   ► Os ids dos itens DEVEM incluir o semestre para não colidir no localStorage
     Padrão sugerido: 'SEMESTRE_DISCID_CATEGORIA_NUMERO'
     Ex: '2026_1_poo_f1'  (use _ no lugar de .)
   ============================================= */

export const CHECKLIST_ITENS = {

  /* ══════════════════════════════════════════
     SEMESTRE 2026.1
  ══════════════════════════════════════════ */
  '2026.1': {

    'poo': {
      categorias: [
        {
          nome: 'Fundamentos',
          icone: '📐',
          itens: [
            { id: '2026_1_poo_f1', texto: 'Revisar conceitos de classes e objetos' },
            { id: '2026_1_poo_f2', texto: 'Entender herança e polimorfismo' },
            { id: '2026_1_poo_f3', texto: 'Praticar encapsulamento e abstração' },
            { id: '2026_1_poo_f4', texto: 'Estudar interfaces e classes abstratas' },
          ]
        },
        {
          nome: 'Exercícios',
          icone: '💻',
          itens: [
            { id: '2026_1_poo_e1', texto: 'Lista 1 — Classes básicas' },
            { id: '2026_1_poo_e2', texto: 'Lista 2 — Herança e polimorfismo' },
            { id: '2026_1_poo_e3', texto: 'Lista 3 — Coleções e generics' },
            { id: '2026_1_poo_e4', texto: 'Projeto final da disciplina' },
          ]
        },
        {
          nome: 'Avaliações',
          icone: '📋',
          itens: [
            { id: '2026_1_poo_a1', texto: 'Revisar prova 1' },
            { id: '2026_1_poo_a2', texto: 'Revisar prova 2' },
            { id: '2026_1_poo_a3', texto: 'Simulado antes da prova final' },
          ]
        }
      ]
    },

    'redes': {
      categorias: [
        {
          nome: 'Modelo OSI / TCP-IP',
          icone: '🌐',
          itens: [
            { id: '2026_1_red_o1', texto: 'Memorizar as 7 camadas do modelo OSI' },
            { id: '2026_1_red_o2', texto: 'Entender o encapsulamento de pacotes' },
            { id: '2026_1_red_o3', texto: 'Diferenciar TCP de UDP' },
          ]
        },
        {
          nome: 'Protocolos',
          icone: '📡',
          itens: [
            { id: '2026_1_red_p1', texto: 'Estudar HTTP / HTTPS' },
            { id: '2026_1_red_p2', texto: 'Entender DNS e DHCP' },
            { id: '2026_1_red_p3', texto: 'Praticar subnetting e máscaras' },
          ]
        },
        {
          nome: 'Avaliações',
          icone: '📋',
          itens: [
            { id: '2026_1_red_a1', texto: 'Revisar prova 1' },
            { id: '2026_1_red_a2', texto: 'Simulado antes da prova final' },
          ]
        }
      ]
    },

    'design': {
      categorias: [
        {
          nome: 'Fundamentos',
          icone: '🎨',
          itens: [
            { id: '2026_1_des_f1', texto: 'Estudar princípios de UX/UI' },
            { id: '2026_1_des_f2', texto: 'Entender fluxos de usuário' },
            { id: '2026_1_des_f3', texto: 'Praticar prototipagem no Figma' },
          ]
        },
        {
          nome: 'Projetos',
          icone: '🖼️',
          itens: [
            { id: '2026_1_des_p1', texto: 'Entrega do projeto de wireframe' },
            { id: '2026_1_des_p2', texto: 'Entrega do protótipo interativo' },
          ]
        },
        {
          nome: 'Avaliações',
          icone: '📋',
          itens: [
            { id: '2026_1_des_a1', texto: 'Revisar prova 1' },
            { id: '2026_1_des_a2', texto: 'Simulado antes da prova final' },
          ]
        }
      ]
    },

    'banco_dados': {
      categorias: [
        {
          nome: 'Modelagem',
          icone: '🗂️',
          itens: [
            { id: '2026_1_bd_m1', texto: 'Criar diagrama ER do projeto' },
            { id: '2026_1_bd_m2', texto: 'Normalizar até 3FN' },
            { id: '2026_1_bd_m3', texto: 'Revisar cardinalidades' },
          ]
        },
        {
          nome: 'SQL',
          icone: '🔍',
          itens: [
            { id: '2026_1_bd_s1', texto: 'Praticar SELECT com JOIN' },
            { id: '2026_1_bd_s2', texto: 'Exercícios de GROUP BY e HAVING' },
            { id: '2026_1_bd_s3', texto: 'Estudar índices e otimização' },
            { id: '2026_1_bd_s4', texto: 'Criar stored procedures básicas' },
          ]
        },
        {
          nome: 'Avaliações',
          icone: '📋',
          itens: [
            { id: '2026_1_bd_a1', texto: 'Revisar prova 1' },
            { id: '2026_1_bd_a2', texto: 'Revisar prova 2' },
            { id: '2026_1_bd_a3', texto: 'Simulado antes da prova final' },
          ]
        }
      ]
    },

  },

  /* ══════════════════════════════════════════
     SEMESTRE 2026.2
  ══════════════════════════════════════════ */
  '2026.2': {

    'poo': {
      categorias: [
        {
          nome: 'Fundamentos',
          icone: '📐',
          itens: [
            { id: '2026_2_poo_f1', texto: 'Revisar conceitos de classes e objetos' },
            { id: '2026_2_poo_f2', texto: 'Entender herança e polimorfismo' },
            { id: '2026_2_poo_f3', texto: 'Praticar encapsulamento e abstração' },
            { id: '2026_2_poo_f4', texto: 'Estudar interfaces e classes abstratas' },
          ]
        },
        {
          nome: 'Exercícios',
          icone: '💻',
          itens: [
            { id: '2026_2_poo_e1', texto: 'Lista 1 — Classes básicas' },
            { id: '2026_2_poo_e2', texto: 'Lista 2 — Herança e polimorfismo' },
            { id: '2026_2_poo_e3', texto: 'Lista 3 — Coleções e generics' },
            { id: '2026_2_poo_e4', texto: 'Projeto final da disciplina' },
          ]
        },
        {
          nome: 'Avaliações',
          icone: '📋',
          itens: [
            { id: '2026_2_poo_a1', texto: 'Revisar prova 1' },
            { id: '2026_2_poo_a2', texto: 'Revisar prova 2' },
            { id: '2026_2_poo_a3', texto: 'Simulado antes da prova final' },
          ]
        }
      ]
    },

    'redes': {
      categorias: [
        {
          nome: 'Modelo OSI / TCP-IP',
          icone: '🌐',
          itens: [
            { id: '2026_2_red_o1', texto: 'Memorizar as 7 camadas do modelo OSI' },
            { id: '2026_2_red_o2', texto: 'Entender o encapsulamento de pacotes' },
            { id: '2026_2_red_o3', texto: 'Diferenciar TCP de UDP' },
          ]
        },
        {
          nome: 'Protocolos',
          icone: '📡',
          itens: [
            { id: '2026_2_red_p1', texto: 'Estudar HTTP / HTTPS' },
            { id: '2026_2_red_p2', texto: 'Entender DNS e DHCP' },
            { id: '2026_2_red_p3', texto: 'Praticar subnetting e máscaras' },
          ]
        },
        {
          nome: 'Avaliações',
          icone: '📋',
          itens: [
            { id: '2026_2_red_a1', texto: 'Revisar prova 1' },
            { id: '2026_2_red_a2', texto: 'Simulado antes da prova final' },
          ]
        }
      ]
    },

    'design': {
      categorias: [
        {
          nome: 'Fundamentos',
          icone: '🎨',
          itens: [
            { id: '2026_2_des_f1', texto: 'Estudar princípios de UX/UI' },
            { id: '2026_2_des_f2', texto: 'Entender fluxos de usuário' },
            { id: '2026_2_des_f3', texto: 'Praticar prototipagem no Figma' },
          ]
        },
        {
          nome: 'Projetos',
          icone: '🖼️',
          itens: [
            { id: '2026_2_des_p1', texto: 'Entrega do projeto de wireframe' },
            { id: '2026_2_des_p2', texto: 'Entrega do protótipo interativo' },
          ]
        },
        {
          nome: 'Avaliações',
          icone: '📋',
          itens: [
            { id: '2026_2_des_a1', texto: 'Revisar prova 1' },
            { id: '2026_2_des_a2', texto: 'Simulado antes da prova final' },
          ]
        }
      ]
    },

    'banco_dados': {
      categorias: [
        {
          nome: 'Modelagem',
          icone: '🗂️',
          itens: [
            { id: '2026_2_bd_m1', texto: 'Criar diagrama ER do projeto' },
            { id: '2026_2_bd_m2', texto: 'Normalizar até 3FN' },
            { id: '2026_2_bd_m3', texto: 'Revisar cardinalidades' },
          ]
        },
        {
          nome: 'SQL',
          icone: '🔍',
          itens: [
            { id: '2026_2_bd_s1', texto: 'Praticar SELECT com JOIN' },
            { id: '2026_2_bd_s2', texto: 'Exercícios de GROUP BY e HAVING' },
            { id: '2026_2_bd_s3', texto: 'Estudar índices e otimização' },
            { id: '2026_2_bd_s4', texto: 'Criar stored procedures básicas' },
          ]
        },
        {
          nome: 'Avaliações',
          icone: '📋',
          itens: [
            { id: '2026_2_bd_a1', texto: 'Revisar prova 1' },
            { id: '2026_2_bd_a2', texto: 'Revisar prova 2' },
            { id: '2026_2_bd_a3', texto: 'Simulado antes da prova final' },
          ]
        }
      ]
    },

  },

  /* ══════════════════════════════════════════
     SEMESTRE 2027.1
     (adicione as disciplinas conforme necessário)
  ══════════════════════════════════════════ */
  '2027.1': {

    /* Exemplo — substitua pelo conteúdo real do semestre */
    'poo': {
      categorias: [
        {
          nome: 'Fundamentos',
          icone: '📐',
          itens: [
            { id: '2027_1_poo_f1', texto: 'Conteúdo do semestre 2027.1' },
          ]
        }
      ]
    },

  },

};