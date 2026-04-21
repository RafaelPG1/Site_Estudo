/* =============================================
   NEXUS STUDY — checklist_data.js
   Conteúdo pré-definido do Checklist por disciplina.

   ► Como usar:
     1. Copie o bloco de exemplo abaixo para cada disciplina.
     2. Use o mesmo `id` que está em global.js / SEMESTRES.
     3. Cada disciplina tem um array de `categorias`.
     4. Cada categoria tem `nome`, `icone` (emoji) e `itens`.
     5. Cada item precisa de um `id` único e um `texto`.

   ► Os checkmarks são salvos automaticamente no localStorage.
   ► O usuário pode resetar por disciplina com o botão "Resetar".
   ============================================= */

export const CHECKLIST_ITENS = {

  /* ──────────────────────────────────────────
     EXEMPLO: substitua 'poo' pelo id real
  ────────────────────────────────────────── */
  'poo': {
    categorias: [
      {
        nome: 'Fundamentos',
        icone: '📐',
        itens: [
          { id: 'poo_f1', texto: 'Revisar conceitos de classes e objetos' },
          { id: 'poo_f2', texto: 'Entender herança e polimorfismo' },
          { id: 'poo_f3', texto: 'Praticar encapsulamento e abstração' },
          { id: 'poo_f4', texto: 'Estudar interfaces e classes abstratas' },
        ]
      },
      {
        nome: 'Exercícios',
        icone: '💻',
        itens: [
          { id: 'poo_e1', texto: 'Lista 1 — Classes básicas' },
          { id: 'poo_e2', texto: 'Lista 2 — Herança e polimorfismo' },
          { id: 'poo_e3', texto: 'Lista 3 — Coleções e generics' },
          { id: 'poo_e4', texto: 'Projeto final da disciplina' },
        ]
      },
      {
        nome: 'Avaliações',
        icone: '📋',
        itens: [
          { id: 'poo_a1', texto: 'Revisar prova 1' },
          { id: 'poo_a2', texto: 'Revisar prova 2' },
          { id: 'poo_a3', texto: 'Simulado antes da prova final' },
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
          { id: 'red_o1', texto: 'Memorizar as 7 camadas do modelo OSI' },
          { id: 'red_o2', texto: 'Entender o encapsulamento de pacotes' },
          { id: 'red_o3', texto: 'Diferenciar TCP de UDP' },
        ]
      },
      {
        nome: 'Protocolos',
        icone: '📡',
        itens: [
          { id: 'red_p1', texto: 'Estudar HTTP / HTTPS' },
          { id: 'red_p2', texto: 'Entender DNS e DHCP' },
          { id: 'red_p3', texto: 'Praticar subnetting e máscaras' },
        ]
      }
    ]
  },

  'bd': {
    categorias: [
      {
        nome: 'Modelagem',
        icone: '🗂️',
        itens: [
          { id: 'bd_m1', texto: 'Criar diagrama ER do projeto' },
          { id: 'bd_m2', texto: 'Normalizar até 3FN' },
          { id: 'bd_m3', texto: 'Revisar cardinalidades' },
        ]
      },
      {
        nome: 'SQL',
        icone: '🔍',
        itens: [
          { id: 'bd_s1', texto: 'Praticar SELECT com JOIN' },
          { id: 'bd_s2', texto: 'Exercícios de GROUP BY e HAVING' },
          { id: 'bd_s3', texto: 'Estudar índices e otimização' },
          { id: 'bd_s4', texto: 'Criar stored procedures básicas' },
        ]
      }
    ]
  },

  /* Adicione mais disciplinas aqui seguindo o mesmo padrão */

};