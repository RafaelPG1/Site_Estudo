// @ts-nocheck
/* =============================================
   NEXUS STUDY — shared/js/audio/play.js
   Dispatcher central de SFX
   Versão 1.2  ← suporte a área/página

   RESPONSABILIDADE ÚNICA
   ─────────────────────────────────────────────
   Expõe playSound(event, area?) — ponto único de disparo
   de efeitos sonoros em qualquer página do projeto.

   ARQUITETURA
   ─────────────────────────────────────────────
   playSound(event, area?)
     │
     ├─ audioState.isReady()            → SFX_MAP do Firebase já carregou?
     │     false → audioState.enqueue(event, area) e sai (sem som agora)
     │     true  → continua
     │
     ├─ audioState.resolveVariant(event, area)
     │     1. Verifica _currentSfxAreaMap[area]?.[event]  (override específico)
     │     2. Fallback: _currentSfxMap[event]             (som geral)
     │
     ├─ audio.sfx[variantId]?.()        → executa via engine sfx.js
     └─ fallback silencioso             → nunca lança erro

   RESOLUÇÃO DE ÁREA
   ─────────────────────────────────────────────
   playSound('click')           → usa som geral de click
   playSound('click', 'game')   → usa override de click para game,
                                   ou geral se não houver override
   playSound('hover', 'resumos')→ usa override de hover para resumos,
                                   ou geral se não houver override

   A área é opcional e case-insensitive (normalizada em audio-state.js).
   Páginas que não passam área continuam funcionando exatamente como antes.

   POR QUE A FILA EXISTE
   ─────────────────────────────────────────────
   Durante o login, há uma janela de ~200ms entre a UI chamar playSound()
   e o Firebase terminar de entregar o SFX_MAP personalizado do usuário.
   Sem a fila, sons chamados nessa janela usariam DEFAULT_SFX_MAP —
   potencialmente a variante errada para aquele usuário.

   Com a fila (incluindo a área):
     - playSound('click', 'game') chama isReady() → false → enqueue('click', 'game')
     - audio-state.js termina de carregar o Firebase (sfxMap + sfxAreaMap)
     - _flushSfxQueue() toca todos os eventos pendentes com os mapas corretos

   DEPENDÊNCIAS
   ─────────────────────────────────────────────
   audio-state.js  — fonte única de verdade (SFX_MAP + área + modo + fila)
   sfx.js          — engine de áudio (executa o som de fato)

   ESTE ARQUIVO NÃO:
   ─────────────────────────────────────────────
   ❌ armazena estado próprio
   ❌ acessa Firebase diretamente
   ❌ conhece o esquema de modos (normal/low/mute)
   ❌ conhece o schema de área — delega tudo para audio-state
   ❌ cria DOM ou elementos visuais
   ❌ duplica lógica de audio-state ou sfx

   USO
   ─────────────────────────────────────────────
   import { playSound } from '/shared/js/audio/play.js';

   // Sons gerais (sem área — comportamento idêntico à v1.1)
   playSound('click');
   playSound('hover');
   playSound('openModal');
   playSound('closeModal');
   playSound('select');

   // Sons com área específica (usa override se existir, senão usa geral)
   playSound('click',  'game');
   playSound('hover',  'resumos');
   playSound('select', 'quiz');
   playSound('click',  'perfil');

   A área pode ser qualquer string lowercase que corresponda às chaves
   definidas no sfxAreaMap do Firebase (configuradas pelo modal).
   ============================================= */

import audioState from './audio-state.js';
import audio      from './sfx.js';

/**
 * Toca o efeito sonoro mapeado para a ação informada,
 * respeitando o override da área/página quando fornecido.
 *
 * Resolução de variante:
 *   1. Override de área: sfxAreaMap[area]?.[event]   → se existir, usa
 *   2. Som geral:        sfxMap[event]               → fallback
 *   3. Silêncio          → se nenhum mapeamento existir
 *
 * Se o SFX_MAP do Firebase ainda não foi carregado (janela de login),
 * o evento (com sua área) é enfileirado em audio-state.js e tocado
 * automaticamente assim que o mapa correto estiver disponível —
 * nunca é perdido, nunca usa a variante errada.
 *
 * @param {string}      event — chave do SFX_MAP (ex: 'click', 'hover', 'openModal')
 * @param {string|null} [area] — identificador de área/página (ex: 'game', 'resumos')
 *                               Opcional. Se omitido, usa apenas o som geral.
 */
export function playSound(event, area = null) {
  // Se o SFX_MAP ainda não foi carregado do Firebase, enfileira o evento
  // (com sua área) e sai. audio-state.js vai tocá-lo com os mapas corretos
  // assim que estiver pronto, via _flushSfxQueue().
  if (!audioState.isReady()) {
    audioState.enqueue(event, area);
    return;
  }

  // Delega toda a lógica de resolução para audio-state.
  // Ele verifica: área → geral → undefined.
  const variantId = audioState.resolveVariant(event, area);

  // Log de diagnóstico — aparece para todos os sons (com ou sem área).
  // Mostra qual variante foi escolhida e se veio de override de área ou do mapa geral.
  if (area) {
    const areaMap     = audioState.getSfxAreaMap();
    const areaKey     = area.toLowerCase();
    const hasOverride = areaMap[areaKey]?.[event];
    console.log(
      `[play] playSound("${event}", "${area}") → variant="${variantId}"`,
      hasOverride
        ? `(área override: "${hasOverride}")`
        : '(sem override — usando geral)'
    );
  } else {
    console.log(`[play] playSound("${event}") → variant="${variantId}" (geral)`);
  }

  if (!variantId) {
    console.warn(`[play] playSound: evento "${event}"${area ? ` (área "${area}")` : ''} não encontrado no SFX_MAP.`);
    return;
  }

  // Executa o som via engine sfx.js.
  audio.sfx[variantId]?.();
}