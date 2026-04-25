/* ═══════════════════════════════════════════════════════════════════
   videos.js — Banco de vídeos das aulas por semestre/disciplina
   ✦ Organizado por { semestre → disciplina → [{ label, url, tipo }] }
   ✦ tipo: 'drive' | 'youtube'
   ✦ redes_professor herda automaticamente os vídeos de redes
════════════════════════════════════════════════════════════════════ */

export const VIDEOS_SEMESTRE = {

  '2026.1': {

    design: [
      { label: 'Vídeo Geral',  url: 'https://drive.google.com/file/d/1zqYcTMjnbkeFfSZPbDXZ-0TSvpKre77O/view?usp=drive_link', tipo: 'drive' },
      { label: 'Aula 1',       url: 'https://drive.google.com/file/d/1N0hkQumdf2MjUmJSfx4AyLK00ienkQk1/view?usp=drive_link', tipo: 'drive' },
      { label: 'Aula 2',       url: 'https://drive.google.com/file/d/1dpnHSyPtOQDJj-ZYpudtVKhT_Oq0yKVP/view?usp=drive_link', tipo: 'drive' },
      { label: 'Aula 3',       url: 'https://drive.google.com/file/d/1r9eoJy2tKvPfrEe5xb7OUQ730yH2joXt/view?usp=drive_link', tipo: 'drive' },
      { label: 'Aula 4',       url: 'https://drive.google.com/file/d/18Pmw9zEKTX7ZXttP_yneyF_N498hvR4C/view?usp=drive_link', tipo: 'drive' },
      { label: 'Aula 5',       url: 'https://drive.google.com/file/d/1SxTUAZmhrsPOT1j-AKJcOPJN0EW-sQHX/view?usp=drive_link', tipo: 'drive' },
      { label: 'Aula 6',       url: 'https://drive.google.com/file/d/1lm9IC6zmMimNR0nkbU0MQBl13K9I0nAB/view?usp=drive_link', tipo: 'drive' },
      { label: 'Aula 7',       url: 'https://drive.google.com/file/d/1-TRhzgSqVBGmRzv6H0HSmBTwwsc9SKW_/view?usp=drive_link', tipo: 'drive' },
      { label: 'Aula 8',       url: 'https://drive.google.com/file/d/1cyFQWAGPdcW8GORd_EBgvni0pDiBLn1Y/view?usp=drive_link', tipo: 'drive' },
    ],

    // ✦ chave deve ser igual ao `id` da disciplina em global.js
    banco_dados: [
      { label: 'Vídeo Geral',  url: 'https://drive.google.com/file/d/1hxjSEKcfaUF_Tdy6Wp0KB6cimewpax5J/view?usp=drive_link', tipo: 'drive' },
      { label: 'Aula 1',       url: 'https://drive.google.com/file/d/13vsVi-oQymHN7VOAGReD4RmFw-qQhxVh/view?usp=drive_link', tipo: 'drive' },
      { label: 'Aula 2',       url: 'https://drive.google.com/file/d/132h5rAZ7HkBJ4jn03YWE2cISSshgESnn/view?usp=drive_link', tipo: 'drive' },
      { label: 'Aula 3',       url: 'https://drive.google.com/file/d/1NTPCkQR6ndo5kt5Lag85PQ-Vz-p9s2Pn/view?usp=drive_link', tipo: 'drive' },
      { label: 'Aula 4',       url: 'https://drive.google.com/file/d/1nKS9mI8fxnFXEkRbQiaJRvcPN3EkZW8J/view?usp=drive_link', tipo: 'drive' },
      { label: 'Aula 5',       url: 'https://drive.google.com/file/d/13wviNisfvxTL_0LjxlEG5M5Fp2OxH6V6/view?usp=drive_link', tipo: 'drive' },
      { label: 'Aula 6',       url: 'https://drive.google.com/file/d/1X5Ngy3qE_XI-M-93-aMC9k6t3Bj_EzIV/view?usp=drive_link', tipo: 'drive' },
      { label: 'Aula 7',       url: 'https://drive.google.com/file/d/1Px7W0TbOQ-q-cg1Dohc-a4MK-1Z2vTJ5/view?usp=drive_link', tipo: 'drive' },
      { label: 'Aula 8',       url: 'https://drive.google.com/file/d/1sBJEg3ev25ubh0ReI4u0V8204SK0PRbq/view?usp=drive_link', tipo: 'drive' },
    ],

    redes: [
      { label: 'Vídeo Geral',          url: 'https://drive.google.com/file/d/1-6XLd_z-FM1q38qxa2vWFFo4sjO0VkTw/view?usp=drive_link', tipo: 'drive'   },
      { label: 'Aulas 1 e 2',          url: 'https://drive.google.com/file/d/1pwrULVqLCaBfxY1MzJTPNYn2nsGq_m_z/view?usp=drive_link', tipo: 'drive'   },
      { label: 'Aulas 3 e 4',          url: 'https://drive.google.com/file/d/1gALBefY4Au-OsoEbmqG69NAsdZe2P5Qc/view?usp=drive_link', tipo: 'drive'   },
      { label: 'Aula 5',               url: 'https://drive.google.com/file/d/1BmIUddd-gsCfQzRds-XM1qDui3qFGICM/view?usp=drive_link', tipo: 'drive'   },
      { label: 'Aula 6',               url: 'https://drive.google.com/file/d/1b1ztYxjGwB3WzVJdXZUh_8EqK42NxmxX/view?usp=drive_link', tipo: 'drive'   },
      { label: 'Curso Fund. de Redes', url: 'https://youtube.com/playlist?list=PLAp37wMSBouDdpuuYhZfEK9oH0qk0IANb&si=qe_XWuYBRVZF2VBy', tipo: 'youtube' },
    ],

    // redes_professor herda os vídeos de redes automaticamente (ver getVideos)

    poo: [
      { label: 'Vídeo Geral',  url: 'https://drive.google.com/file/d/1vP3yVEA86ybNSZDMt2AJ61Kquc-UZHkf/view?usp=drive_link', tipo: 'drive' },
      { label: 'Aula 1',       url: 'https://drive.google.com/file/d/1BQ3qiR1Rk-9Sh3ERFkKnKT4gSN4qBfko/view?usp=drive_link', tipo: 'drive' },
      { label: 'Aula 2',       url: 'https://drive.google.com/file/d/1BQ3qiR1Rk-9Sh3ERFkKnKT4gSN4qBfko/view?usp=drive_link', tipo: 'drive' },
      { label: 'Aula 3',       url: 'https://drive.google.com/file/d/1xerybYBcESckEivxS5FEGTbMFpW6lrHX/view?usp=drive_link', tipo: 'drive' },
      { label: 'Aula 4',       url: 'https://drive.google.com/file/d/14uMg0tp1x5ua3cRuIS3YcfGYmAji96Cx/view?usp=drive_link', tipo: 'drive' },
      { label: 'Aula 5',       url: 'https://drive.google.com/file/d/1h8a2ZCaFp0pw5x39BVTEEoeOfJ9d3X68/view?usp=drive_link', tipo: 'drive' },
    ],

  },

  // Adicione novos semestres aqui ↓
  // '2026.2': { ... }

};

/* ═══════════════════════════════════════════════════════════════════
   getVideos(semestre, discId)
   Retorna array filtrado de vídeos com URL válida.
   redes_professor herda de redes automaticamente.
════════════════════════════════════════════════════════════════════ */
export function getVideos(semestre, discId) {
  const sem = VIDEOS_SEMESTRE[semestre];
  if (!sem) return [];

  const key   = discId === 'redes_professor' ? 'redes' : discId;
  const lista = sem[key];
  if (!lista) return [];

  return lista.filter(v => v && v.url && v.url.trim() !== '');
}