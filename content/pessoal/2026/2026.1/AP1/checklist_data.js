/* content\pessoal\2026\2026.1/AP1\checklist_data.js
   proibo de mudar o caminho, os arquivos deve ter os caminhos para saber onde estar

   Fonte de dados do Checklist para o semestre 2026-AP1.
   APENAS dados — nenhuma lógica, nenhum salvamento, nenhum
   HTML/CSS. Lido dinamicamente por
   dashboard/js/checklist/checklist.js com base no semestre
   selecionado no Dashboard. Este arquivo nunca é modificado pelo
   sistema; o progresso do usuário é armazenado separadamente
   (ver checklist_storage.js).
*/

export const checklistData = {
  disciplinas: [
    {
      disciplinaId: 'poo',
      categorias: [
        {
          id: 'conteudos',
          nome: 'Conteúdos',
          itens: [
            { id: 'poo-classes', titulo: 'Classes e Objetos' },
            { id: 'poo-atributos', titulo: 'Atributos e Métodos' },
            { id: 'poo-construtores', titulo: 'Construtores' },
            { id: 'poo-encapsulamento', titulo: 'Encapsulamento' },
            { id: 'poo-heranca', titulo: 'Herança' },
            { id: 'poo-polimorfismo', titulo: 'Polimorfismo' },
            { id: 'poo-abstracao', titulo: 'Abstração' },
            { id: 'poo-interfaces', titulo: 'Interfaces' },
            { id: 'poo-classes-abstratas', titulo: 'Classes Abstratas' },
            { id: 'poo-excecoes', titulo: 'Tratamento de Exceções' },
            { id: 'poo-colecoes', titulo: 'Coleções (List, Set e Map)' },
            { id: 'poo-generics', titulo: 'Generics' },
          ],
        },
        {
          id: 'atividades',
          nome: 'Atividades',
          itens: [
            { id: 'poo-lista1', titulo: 'Lista de Exercícios 1' },
            { id: 'poo-lista2', titulo: 'Lista de Exercícios 2' },
            { id: 'poo-lista3', titulo: 'Lista de Exercícios 3' },
            { id: 'poo-desafio', titulo: 'Desafio Prático' },
            { id: 'poo-projeto', titulo: 'Projeto Final' },
          ],
        },
        {
          id: 'revisao',
          nome: 'Revisão',
          itens: [
            { id: 'poo-resumo', titulo: 'Fazer resumo da disciplina' },
            { id: 'poo-simulado', titulo: 'Resolver simulado' },
            { id: 'poo-ap1', titulo: 'Revisar para AP1' },
          ],
        },
      ],
    },

    {
      disciplinaId: 'redes',
      categorias: [
        {
          id: 'conteudos',
          nome: 'Conteúdos',
          itens: [
            { id: 'redes-intro', titulo: 'Introdução às Redes' },
            { id: 'redes-modelo-osi', titulo: 'Modelo OSI' },
            { id: 'redes-tcpip', titulo: 'Modelo TCP/IP' },
            { id: 'redes-ipv4', titulo: 'Endereçamento IPv4' },
            { id: 'redes-subredes', titulo: 'Subnetting' },
            { id: 'redes-ipv6', titulo: 'IPv6' },
            { id: 'redes-dns', titulo: 'DNS' },
            { id: 'redes-dhcp', titulo: 'DHCP' },
            { id: 'redes-http', titulo: 'HTTP e HTTPS' },
            { id: 'redes-switch', titulo: 'Switches' },
            { id: 'redes-roteadores', titulo: 'Roteadores' },
            { id: 'redes-seguranca', titulo: 'Segurança em Redes' },
            { id: 'redes-firewall', titulo: 'Firewall' },
            { id: 'redes-vlan', titulo: 'VLAN' },
          ],
        },
        {
          id: 'laboratorio',
          nome: 'Laboratório',
          itens: [
            { id: 'redes-packettracer', titulo: 'Montar rede no Packet Tracer' },
            { id: 'redes-ping', titulo: 'Testar conectividade com Ping' },
            { id: 'redes-config', titulo: 'Configurar IP estático' },
            { id: 'redes-roteador', titulo: 'Configurar roteador' },
            { id: 'redes-switch-lab', titulo: 'Configurar switch' },
          ],
        },
        {
          id: 'revisao',
          nome: 'Revisão',
          itens: [
            { id: 'redes-exercicios', titulo: 'Resolver lista de exercícios' },
            { id: 'redes-simulado', titulo: 'Fazer simulado' },
            { id: 'redes-ap1', titulo: 'Revisar para AP1' },
          ],
        },
      ],
    },

    {
      disciplinaId: 'design',
      categorias: [
        {
          id: 'ux-ui',
          nome: 'UX/UI',
          itens: [
            { id: 'design-cores', titulo: 'Teoria das Cores' },
            { id: 'design-tipografia', titulo: 'Tipografia' },
            { id: 'design-contraste', titulo: 'Contraste e Hierarquia Visual' },
            { id: 'design-grid', titulo: 'Grid Layout' },
            { id: 'design-wireframe', titulo: 'Wireframes' },
            { id: 'design-prototipo', titulo: 'Protótipos' },
            { id: 'design-componentes', titulo: 'Componentes Reutilizáveis' },
            { id: 'design-designsystem', titulo: 'Design System' },
            { id: 'design-acessibilidade', titulo: 'Acessibilidade' },
            { id: 'design-responsivo', titulo: 'Design Responsivo' },
          ],
        },
        {
          id: 'projetos',
          nome: 'Projetos',
          itens: [
            { id: 'design-landing', titulo: 'Criar Landing Page' },
            { id: 'design-dashboard', titulo: 'Criar Dashboard' },
            { id: 'design-mobile', titulo: 'Criar Interface Mobile' },
            { id: 'design-portfolio', titulo: 'Projeto Final' },
          ],
        },
        {
          id: 'revisao',
          nome: 'Revisão',
          itens: [
            { id: 'design-checklist', titulo: 'Revisar princípios de UX' },
            { id: 'design-simulado', titulo: 'Resolver exercícios' },
            { id: 'design-ap1', titulo: 'Revisar para AP1' },
          ],
        },
      ],
    },

    {
      disciplinaId: 'banco_dados',
      categorias: [
        {
          id: 'modelagem',
          nome: 'Modelagem',
          itens: [
            { id: 'bd-entidades', titulo: 'Entidades e Atributos' },
            { id: 'bd-relacionamentos', titulo: 'Relacionamentos' },
            { id: 'bd-cardinalidade', titulo: 'Cardinalidade' },
            { id: 'bd-modelo-er', titulo: 'Modelo Entidade-Relacionamento' },
            { id: 'bd-normalizacao1', titulo: '1ª Forma Normal' },
            { id: 'bd-normalizacao2', titulo: '2ª Forma Normal' },
            { id: 'bd-normalizacao3', titulo: '3ª Forma Normal' },
          ],
        },
        {
          id: 'sql',
          nome: 'SQL',
          itens: [
            { id: 'bd-create', titulo: 'CREATE TABLE' },
            { id: 'bd-alter', titulo: 'ALTER TABLE' },
            { id: 'bd-insert', titulo: 'INSERT' },
            { id: 'bd-update', titulo: 'UPDATE' },
            { id: 'bd-delete', titulo: 'DELETE' },
            { id: 'bd-select', titulo: 'SELECT' },
            { id: 'bd-where', titulo: 'WHERE' },
            { id: 'bd-order', titulo: 'ORDER BY' },
            { id: 'bd-group', titulo: 'GROUP BY' },
            { id: 'bd-joins', titulo: 'JOINS' },
            { id: 'bd-views', titulo: 'Views' },
            { id: 'bd-procedures', titulo: 'Stored Procedures' },
          ],
        },
        {
          id: 'revisao',
          nome: 'Revisão',
          itens: [
            { id: 'bd-exercicios', titulo: 'Resolver lista SQL' },
            { id: 'bd-modelagem-final', titulo: 'Modelar banco completo' },
            { id: 'bd-simulado', titulo: 'Fazer simulado' },
            { id: 'bd-ap1', titulo: 'Revisar para AP1' },
          ],
        },
      ],
    },
  ],
};