// @ts-nocheck
/* =============================================
   NEXUS STUDY — shared/js/audio/play.js
   Dispatcher central de SFX
   Versão 1.1

   RESPONSABILIDADE ÚNICA
   ─────────────────────────────────────────────
   Expõe playSound(event) — ponto único de disparo
   de efeitos sonoros em qualquer página do projeto.

   ARQUITETURA
   ─────────────────────────────────────────────
   playSound(event)
     │
     ├─ audioState.isReady()         → SFX_MAP do Firebase já carregou?
     │     false → audioState.enqueue(event) e sai (sem som agora)
     │     true  → continua
     │
     ├─ audioState.getSfxMap()       → resolve variante atual (ex: 'click2')
     ├─ audio.sfx[variantId]?.()     → executa via engine sfx.js
     └─ fallback silencioso          → nunca lança erro

   POR QUE A FILA EXISTE
   ─────────────────────────────────────────────
   Durante o login, há uma janela de ~200ms entre a UI chamar playSound()
   e o Firebase terminar de entregar o SFX_MAP personalizado do usuário.
   Sem a fila, sons chamados nessa janela usariam DEFAULT_SFX_MAP —
   potencialmente a variante errada para aquele usuário.

   Com a fila:
     - playSound() chama isReady() → false → enqueue(event)
     - audio-state.js termina de carregar o Firebase
     - _flushSfxQueue() toca todos os eventos pendentes com o mapa correto

   Fora da janela de login (visitante ou pós-load), isReady() === true
   e playSound() executa diretamente, sem overhead.

   DEPENDÊNCIAS
   ─────────────────────────────────────────────
   audio-state.js  — fonte única de verdade (SFX_MAP + modo + fila)
   sfx.js          — engine de áudio (executa o som de fato)

   ESTE ARQUIVO NÃO:
   ─────────────────────────────────────────────
   ❌ armazena estado próprio
   ❌ acessa Firebase diretamente
   ❌ conhece o esquema de modos (normal/low/mute)
   ❌ cria DOM ou elementos visuais
   ❌ duplica lógica de audio-state ou sfx

   USO
   ─────────────────────────────────────────────
   import { playSound } from '/shared/js/audio/play.js';

   playSound('click');      // toca a variante mapeada para 'click'
   playSound('hover');      // toca a variante mapeada para 'hover'
   playSound('openModal');  // toca a variante mapeada para 'openModal'
   playSound('closeModal'); // toca a variante mapeada para 'closeModal'
   playSound('select');     // toca a variante mapeada para 'select'

   As variantes reais são definidas no SFX_MAP do audio-state.js
   e podem ser personalizadas por usuário via Firebase.
   Qualquer mudança de login ou preferência reflete automaticamente,
   sem nenhuma alteração neste arquivo ou nas páginas que o importam.
   ============================================= */

import audioState from './audio-state.js';
import audio      from './sfx.js';

/**
 * Toca o efeito sonoro mapeado para a ação informada.
 *
 * Se o SFX_MAP do Firebase ainda não foi carregado (janela de login),
 * o evento é enfileirado em audio-state.js e tocado automaticamente
 * assim que o mapa correto estiver disponível — nunca é perdido,
 * nunca usa a variante errada.
 *
 * Fora da janela de login, executa diretamente sem overhead.
 *
 * @param {string} event — chave do SFX_MAP (ex: 'click', 'hover', 'openModal')
 */
export function playSound(event) {
  // Se o SFX_MAP ainda não foi carregado do Firebase, enfileira o evento
  // e sai. audio-state.js vai tocá-lo com o mapa correto assim que estiver
  // pronto, via _flushSfxQueue(). Nenhum som é perdido; nenhum som errado vaza.
  if (!audioState.isReady()) {
    audioState.enqueue(event);
    return;
  }

  // Obtém o mapa de sons atual do usuário (cópia — não referência).
  // Reflete o estado do Firebase sem necessidade de re-importar.
  const sfxMap = audioState.getSfxMap();

  // Resolve a variante mapeada para este evento.
  const variantId = sfxMap[event];

  if (!variantId) {
    console.warn(`[play] playSound: evento "${event}" não encontrado no SFX_MAP.`);
    return;
  }

  // Executa o som via engine sfx.js.
  // O Proxy de sfxApi retorna undefined para ids desconhecidos — o ?. garante silêncio.
  audio.sfx[variantId]?.();
}