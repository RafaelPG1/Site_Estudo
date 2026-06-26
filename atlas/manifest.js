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

];