/* ═══════════════════════════════════════════════════════════════
   NEXUS STUDY — show_milhao/storage_sm.js
   Persistência 100% localStorage — sem Firebase, sem dependências externas.

   Chaves usadas:
     sm_estado__{discId}__{sem}        ← estado completo da partida em curso
     sm_historico__{uid}__{discId}__{sem}  ← histórico acumulado de desempenho

   Estado da partida (salvo após CADA ação):
     {
       indice:         number,       ← questão atual
       acertos:        number,       ← prêmios conquistados
       respostas:      array,        ← undefined | null | 'A'|'B'|'C'|'D'
       tempos:         number[],     ← tempo restante em cada questão
       temErro:        boolean,
       indicePendente: number|null,
       premioPendente: number|null,
       tempoInicio:    number,       ← Date.now() do início
       perguntas:      object[],     ← deck embaralhado (IDs + dados completos)
       discId:         string,
       sem:            string,
       uid:            string,
       versao:         number,       ← para invalidar saves antigos
     }
═══════════════════════════════════════════════════════════════ */

const VERSAO_SAVE = 3; // incremente se mudar a estrutura do estado

/* ── Prefixos de chave ─────────────────────────────────────── */
const _chaveEstado    = (discId, sem)       => `sm_estado__${discId}__${sem}`;
const _chaveHistorico = (uid, discId, sem)  => `sm_historico__${uid}__${discId}__${sem}`;

/* ════════════════════════════════════════════════════════════
   DEBUG — log prefixado, sempre ativo
════════════════════════════════════════════════════════════ */
export function smLog(...args) {
  console.log('[SM-Storage]', ...args);
}
export function smWarn(...args) {
  console.warn('[SM-Storage ⚠]', ...args);
}
export function smError(...args) {
  console.error('[SM-Storage ✖]', ...args);
}

/* ════════════════════════════════════════════════════════════
   HELPERS INTERNOS
════════════════════════════════════════════════════════════ */

/** Lê e parseia uma chave do localStorage. Retorna null em caso de falha. */
function _ler(chave) {
  try {
    const raw = localStorage.getItem(chave);
    if (raw === null) return null;
    return JSON.parse(raw);
  } catch (err) {
    smWarn(`Erro ao ler "${chave}":`, err.message);
    return null;
  }
}

/**
 * Escreve no localStorage e verifica que foi salvo corretamente.
 * Retorna true em sucesso, false em falha.
 */
function _escrever(chave, dados) {
  try {
    const json = JSON.stringify(dados);
    localStorage.setItem(chave, json);

    // Verificação pós-escrita obrigatória
    const verificado = localStorage.getItem(chave);
    if (verificado !== json) {
      smError(`Verificação pós-escrita FALHOU para "${chave}". Dado não foi salvo!`);
      return false;
    }
    return true;
  } catch (err) {
    smError(`Erro ao escrever "${chave}":`, err.message);
    return false;
  }
}

/* ════════════════════════════════════════════════════════════
   ESTADO DA PARTIDA EM CURSO
   (salvo imediatamente após cada ação do usuário)
════════════════════════════════════════════════════════════ */

/**
 * Salva o estado completo da partida.
 * DEVE ser chamado imediatamente após qualquer mudança de estado.
 */
export function salvarEstadoPartida(estado) {
  const { discId, sem } = estado;

  if (!discId || !sem) {
    smWarn('salvarEstadoPartida: discId ou sem ausente — abortando.', { discId, sem });
    return false;
  }

  const payload = {
    versao:         VERSAO_SAVE,
    indice:         estado.indice,
    acertos:        estado.acertos,
    // JSON.stringify converte slots vazios (undefined) em null, que confunde com timeout.
    // Usamos a string '__vazio__' como sentinela para "não respondida ainda".
    respostas:      Array.from({ length: estado.respostas.length }, (_, i) =>
                      estado.respostas[i] === undefined ? '__vazio__' : estado.respostas[i]
                    ),
    tempos:         estado.tempos,
    temErro:        estado.temErro,
    indicePendente: estado.indicePendente,
    premioPendente: estado.premioPendente,
    tempoInicio:    estado.tempoInicio,
    perguntas:      estado.perguntas,
    discId,
    sem,
    uid:            estado.usuario ?? '_local',
    salvoEm:        Date.now(),
  };

  const chave = _chaveEstado(discId, sem);
  const ok = _escrever(chave, payload);

  if (ok) {
    smLog(`Estado salvo ✓  [Q${estado.indice + 1} | acertos:${estado.acertos} | erros:${estado.temErro}]`,
      `→ respostas: [${estado.respostas.map(r => r ?? '—').join(', ')}]`);
  }

  return ok;
}

/**
 * Carrega o estado salvo de uma partida em curso.
 * Retorna null se não houver save ou se estiver desatualizado/corrompido.
 */
export function carregarEstadoPartida(discId, sem) {
  const chave = _chaveEstado(discId, sem);
  const dados = _ler(chave);

  if (!dados) {
    smLog(`Sem partida salva para ${discId}/${sem}.`);
    return null;
  }

  if (dados.versao !== VERSAO_SAVE) {
    smWarn(`Save desatualizado (v${dados.versao} ≠ v${VERSAO_SAVE}) — descartando.`);
    localStorage.removeItem(chave);
    return null;
  }

  if (!dados.perguntas || !Array.isArray(dados.perguntas) || dados.perguntas.length === 0) {
    smWarn('Save inválido (perguntas ausentes) — descartando.');
    localStorage.removeItem(chave);
    return null;
  }

  const idadeMin = Math.round((Date.now() - dados.salvoEm) / 60000);
  smLog(`Partida salva encontrada ✓  (salva há ${idadeMin} min, Q${dados.indice + 1}/${dados.perguntas.length})`);

  // Restaura sentinela '__vazio__' de volta para undefined (slot não respondido)
  dados.respostas = dados.respostas.map(r => r === '__vazio__' ? undefined : r);

  return dados;
}

/**
 * Apaga o estado da partida em curso (ao finalizar ou reiniciar).
 */
export function limparEstadoPartida(discId, sem) {
  const chave = _chaveEstado(discId, sem);
  localStorage.removeItem(chave);
  smLog(`Estado de partida apagado: ${chave}`);
}

/* ════════════════════════════════════════════════════════════
   HISTÓRICO DE DESEMPENHO
   (acumulado entre partidas — persiste para sempre)
════════════════════════════════════════════════════════════ */

/**
 * Carrega o histórico acumulado de acertos/erros por questão.
 * Retorna sempre um objeto (nunca null).
 */
export function carregarHistoricoSM(usuario, discId, sem) {
  const uid   = usuario && usuario !== 'visitante' ? usuario : '_local';
  const chave = _chaveHistorico(uid, discId, sem);
  const dados = _ler(chave) ?? {};

  smLog(`Histórico carregado: ${Object.keys(dados).length} questão(ões) com registro.`);
  return dados;
}

/**
 * Salva o resultado de uma rodada no histórico acumulado.
 * resultados: [{ id, acertou, resp }]
 * Questões com resp===null (timeout) são neutras e ignoradas.
 */
export function salvarResultadoSM(usuario, discId, sem, resultados) {
  if (!Array.isArray(resultados) || resultados.length === 0) {
    smWarn('salvarResultadoSM: lista vazia — nada a salvar.');
    return false;
  }

  const validos = resultados.filter(r => r.resp !== null && r.resp !== undefined);

  if (validos.length === 0) {
    smLog('salvarResultadoSM: apenas timeouts — histórico não alterado.');
    return false;
  }

  const uid   = usuario && usuario !== 'visitante' ? usuario : '_local';
  const chave = _chaveHistorico(uid, discId, sem);

  // Lê histórico atual
  const atual = _ler(chave) ?? {};

  // Aplica resultados desta rodada
  for (const { id, acertou } of validos) {
    if (!id) { smWarn('Questão sem id ignorada:', { id, acertou }); continue; }

    const entrada = atual[id] ?? {
      tentativas: 0, acertos: 0, erros: 0,
      ultimaVez: 0, acertosConsecutivos: 0,
    };

    entrada.tentativas++;
    if (acertou) {
      entrada.acertos++;
      entrada.acertosConsecutivos = (entrada.acertosConsecutivos ?? 0) + 1;
    } else {
      entrada.erros++;
      entrada.acertosConsecutivos = 0;
    }
    entrada.ultimaVez = Date.now();
    atual[id] = entrada;
  }

  const ok = _escrever(chave, atual);

  if (ok) {
    smLog(`Histórico salvo ✓  ${validos.length} resultado(s) → total: ${Object.keys(atual).length} questão(ões).`);
    smLog('Detalhe desta rodada:', validos.map(r => `${r.id}=${r.acertou ? '✓' : '✗'}`).join(' '));
  }

  return ok;
}

/**
 * Apaga o histórico acumulado de uma disciplina.
 */
export function limparHistoricoSM(usuario, discId, sem) {
  const uid   = usuario && usuario !== 'visitante' ? usuario : '_local';
  const chave = _chaveHistorico(uid, discId, sem);
  localStorage.removeItem(chave);
  smLog(`Histórico apagado: ${chave}`);
}

/* ════════════════════════════════════════════════════════════
   DEBUG / UTILITÁRIOS
════════════════════════════════════════════════════════════ */

/** Imprime no console tudo que está salvo no localStorage do SM. */
export function debugEstado(discId, sem) {
  console.groupCollapsed('[SM-Debug] Estado completo do localStorage');

  const estado = discId && sem ? _ler(_chaveEstado(discId, sem)) : null;
  console.log('▶ Estado da partida:', estado ?? '(nenhum)');

  const chaveHistRegex = /^sm_historico__/;
  const historicos = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && chaveHistRegex.test(k)) {
      historicos[k] = _ler(k);
    }
  }
  console.log('▶ Históricos salvos:', historicos);

  const todasChavesSM = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith('sm_')) todasChavesSM.push(k);
  }
  console.log('▶ Todas as chaves SM:', todasChavesSM);
  console.groupEnd();
}

/** Lista todas as chaves SM no localStorage. */
export function listarChavesSM() {
  const chaves = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith('sm_')) chaves.push(k);
  }
  smLog('Chaves SM encontradas:', chaves);
  return chaves;
}

// Expõe debugEstado globalmente para uso no console do browser
if (typeof window !== 'undefined') {
  window.smDebug = debugEstado;
  window.smChaves = listarChavesSM;
}