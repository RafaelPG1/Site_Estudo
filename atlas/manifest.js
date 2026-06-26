/* =============================================
   atlas — manifest.js
   Localização: atlas/manifest.js

   Fonte oficial de metadados de todas as disciplinas.
   Cada entrada define: id, title, desc, type, time,
   theme, color, icon e o caminho do arquivo de conteúdo.

   Para adicionar uma nova disciplina:
     1. Crie o arquivo de conteúdo em content/atlas/linux.js
     2. Adicione a entrada aqui com os metadados
     3. Pronto — nenhuma outra alteração necessária.

   O campo `theme` é apenas um identificador semântico
   (ex.: "indigo", "emerald", "cyan").
   O atlas.js aplica data-theme="<valor>" nos elementos.
   Toda a aparência é responsabilidade exclusiva do CSS:
     [data-theme="indigo"] { ... }
     [data-theme="emerald"] { ... }

   O campo `color` (opcional, hex — ex.: "#3776AB") define
   a cor de fundo do quadrado do ícone dessa disciplina.
   O atlas.js converte o hex para RGB e injeta como a
   variável CSS --cat-rgb no elemento do ícone. Se omitido,
   a cor cai no ciclo padrão de 6 cores definido no CSS
   (por posição, via nth-child / data-color-index).
   ============================================= */

window.__atlasManifest = [

  {
    id:      'python',
    title:   'Python',
    desc:    'Documentação completa de Python: dos fundamentos básicos às estruturas de dados, controle de fluxo e funções.',
    type:    'Documentação',
    time:    48,
    theme:   'indigo',
    color:   '#3776AB',
    icon: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
      <path fill="#3776AB" d="M63.6 2.1c-31 0-29 13.4-29 13.4v14h29.5v4.2H22.5S2 31.4 2 63.4s17.8 30.4 17.8 30.4h10.6V79.4s-.6-17.8 17.5-17.8h28.5s16.9.3 16.9-16.4V18.8S95.3 2.1 63.6 2.1z"/>
      <path fill="#FFD43B" d="M64.4 125.9c31 0 29-13.4 29-13.4v-14H63.9v-4.2h41.6S126 96.6 126 64.6s-17.8-30.4-17.8-30.4H97.6v14.4s.6 17.8-17.5 17.8H51.6s-16.9-.3-16.9 16.4v27.4s-2.6 16.7 29.7 16.7z"/>
    </svg>`,
    content: '../content/atlas/python.js',
  },
  {
  id: 'javascript',
  title: 'JavaScript',
  desc: 'Documentação completa de JavaScript: fundamentos, DOM, ES6+, programação assíncrona, módulos e boas práticas.',
  type: 'Documentação',
  time: 54,
  theme: 'yellow',
  color: '#F7DF1E',
  icon: `<svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
    <rect width="128" height="128" fill="#F7DF1E"/>
    <path d="M76.5 100.6c2.6 4.2 6 7.3 12.1 7.3 5.1 0 8.4-2.5 8.4-6.1 0-4.2-3.3-5.7-8.9-8.1l-3-1.3c-8.7-3.7-14.4-8.3-14.4-18.1 0-9 6.9-15.9 17.7-15.9 7.7 0 13.2 2.7 17.2 9.7l-9.4 6c-2.1-3.7-4.3-5.1-7.8-5.1-3.5 0-5.8 2.2-5.8 5.1 0 3.6 2.2 5 7.3 7.2l3 1.3c10.2 4.4 15.9 8.8 15.9 18.8 0 10.8-8.5 16.7-19.9 16.7-11.2 0-18.5-5.3-22-12zM34.5 101.6c1.9 3.4 3.7 6.3 8 6.3 4.1 0 6.7-1.6 6.7-7.8V58.8h11.2v41.5c0 12.6-7.4 18.4-18.2 18.4-9.8 0-15.4-5.1-18.3-11.2z"/>
  </svg>`,
  content: '../content/atlas/javascript.js',
},


{
  id: 'cpp',
  title: 'C++',
  desc: 'Documentação completa de C++: sintaxe, ponteiros, memória, STL, orientação a objetos e recursos modernos.',
  type: 'Documentação',
  time: 64,
  theme: 'blue',
  color: '#00599C',
  icon: 'C++',
  content: '../content/atlas/cpp.js',
},

];