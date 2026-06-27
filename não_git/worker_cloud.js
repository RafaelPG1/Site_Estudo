// ─── worker.js — Cloudflare Nexus IA v11.1 ──────────────────────────────────
//
// Mudanças em relação ao v11.0:
//
//   SYSTEM_TUTOR reescrito:
//   - Limite de 2 parágrafos agora é regra absoluta (não sugestão).
//   - Lista de frases de enchimento explicitamente proibidas.
//
// ─────────────────────────────────────────────────────────────────────────────

// ── Mapeamento de model id → nome legível ────────────────────────────────────
const MODELO_LABEL = {
  'llama-3.3-70b-versatile': 'Llama 3.3 70B',
  'mixtral-8x7b-32768':      'Mixtral 8x7B',
  // OpenRouter (comentado — reativar quando houver crédito):
  // 'deepseek/deepseek-chat-v3-0324:free': 'DeepSeek V3',
  // 'google/gemini-2.5-flash:free':        'Gemini 2.5 Flash',
  // 'qwen/qwen3.6-plus:free':              'Qwen 3.6 Plus',
};

function _labelModelo(modelId) {
  return MODELO_LABEL[modelId] || modelId;
}

// ── System prompt — tutor educacional ────────────────────────────────────────
const SYSTEM_TUTOR = `Você é um tutor educacional direto e objetivo.
Responda sempre em português do Brasil.

TAMANHO DAS RESPOSTAS — REGRA ABSOLUTA:
- Padrão: 1 parágrafo curto. Sem exceção.
- Use listas APENAS se o conteúdo for naturalmente enumerável (passos, comparações).
- Adapte SOMENTE se o aluno pedir explicitamente:
  "resumidamente" → 1-2 frases
  "detalhadamente" / "aprofunde" → até 3 parágrafos
  "dê um exemplo" → exemplo concreto, curto
  "explique melhor" → reformule com outra abordagem, ainda 1 parágrafo

REGRAS:
1. Tutor — não resumidor. Use os fatos de referência como âncora factual, não reescreva.
2. Se houver histórico, mantenha coerência com o último tema.
3. Sem fatos de referência: responda com seu próprio conhecimento com confiança.
4. Fatos de referência têm prioridade quando existem.
5. PROIBIDO: nunca mencione fatos de referência, ausência de contexto ou que recebeu (ou não) material externo.
6. Não repita a pergunta do aluno.
7. Não use frases de enchimento: "É importante notar", "Além disso", "É fundamental", "Cabe ressaltar".`;

// ── System prompt — navegação e planejamento ─────────────────────────────────
const SYSTEM_NAVEGACAO = `Você é um tutor educacional especializado em orientar estudos.
Responda sempre em português do Brasil.

CONTEXTO QUE VOCÊ RECEBERÁ:
Você receberá o mapa estrutural de uma disciplina: lista de aulas em ordem,
com seus títulos e as seções que cada uma contém.

REGRAS:
1. Use o mapa estrutural para responder perguntas sobre sequência, ordem e planejamento.
   A ordem das aulas no mapa é a sequência natural da disciplina.
2. Para pré-requisitos: aulas anteriores geralmente são base das seguintes.
   Use os títulos e seções para inferir dependências temáticas.
3. Para planos de estudo: proponha sequências concretas usando os nomes reais das aulas.
   Seja direto — diga "comece pela Aula 1 (X), depois vá para a Aula 2 (Y)".
4. Para perguntas como "qual aula estudar primeiro": indique a primeira do mapa,
   a menos que o aluno já tenha especificado um tema de interesse.
5. Para "liste todas as aulas": apresente a lista completa em ordem, com os títulos reais.
6. Nunca invente aulas que não estão no mapa. Use apenas as informações recebidas.
7. Seja objetivo. Máximo 4 parágrafos ou uma lista objetiva com as aulas reais.
8. Não repita a pergunta do aluno na resposta.`;

// ── Chamadores Groq ───────────────────────────────────────────────────────────

async function chamarLlama(mensagens, apiKey) {
  const modelId = 'llama-3.3-70b-versatile';
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model:       modelId,
      max_tokens:  800,
      temperature: 0.5,
      messages:    mensagens,
    }),
  });
  return { res, modelId };
}

async function chamarMixtral(mensagens, apiKey) {
  const modelId = 'mixtral-8x7b-32768';
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model:       modelId,
      max_tokens:  800,
      temperature: 0.5,
      messages:    mensagens,
    }),
  });
  return { res, modelId };
}

// ── OpenRouter (comentado — reativar quando houver crédito) ───────────────────
//
// async function chamarOpenRouter(mensagens, apiKey, modelId) {
//   const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//     method: "POST",
//     headers: {
//       "Content-Type":  "application/json",
//       "Authorization": `Bearer ${apiKey}`,
//       "HTTP-Referer":  "https://rafaelpeixoto475.workers.dev",
//       "X-Title":       "Nexus Assistente",
//     },
//     body: JSON.stringify({
//       model:       modelId,
//       max_tokens:  800,
//       temperature: 0.5,
//       messages:    mensagens,
//     }),
//   });
//   return { res, modelId };
// }
//
// Modelos disponíveis quando reativar:
//   deepseek/deepseek-chat-v3-0324:free
//   google/gemini-2.5-flash:free
//   qwen/qwen3.6-plus:free
//
// Para reativar, descomentar a função acima e adicionar nas cascatas em
// _montarCascata(), por exemplo:
//   const deepseek = { nome: 'OpenRouter', fn: (m) => chamarOpenRouter(m, env.API_KEY_OPENROUTER, 'deepseek/deepseek-chat-v3-0324:free') };

// ── Roteamento por tipoContexto ───────────────────────────────────────────────
//
// conteudo  → Llama (rápido, bom para explicações) → Mixtral (fallback)
// global    → Mixtral (32k context, bom para resumos) → Llama (fallback)
// estrutura → Llama (bom para planejamento) → Mixtral (fallback)
//
function _montarCascata(tipoContexto, env) {
  const llama   = { nome: 'Groq', fn: (m) => chamarLlama(m,   env.API_KEY_GROQ) };
  const mixtral = { nome: 'Groq', fn: (m) => chamarMixtral(m, env.API_KEY_GROQ) };

  if (tipoContexto === 'global') return [mixtral, llama  ];
  /* conteudo e estrutura */      return [llama,   mixtral];
}

// ── Executor da cascata ───────────────────────────────────────────────────────
async function _chamarEmCascata(cascata, mensagens) {
  let todosRateLimit = true;

  for (const provedor of cascata) {
    let result;
    try {
      result = await provedor.fn(mensagens);
    } catch (err) {
      console.warn(`[${provedor.nome}] falha de rede:`, err);
      todosRateLimit = false;
      continue;
    }

    if (result.res.status === 429) {
      console.warn(`[${provedor.nome}/${result.modelId}] rate limit — próximo provedor`);
      continue;
    }

    todosRateLimit = false;

    if (!result.res.ok) {
      console.warn(`[${provedor.nome}/${result.modelId}] HTTP ${result.res.status} — próximo provedor`);
      continue;
    }

    let data;
    try {
      data = await result.res.json();
    } catch {
      console.warn(`[${provedor.nome}/${result.modelId}] JSON inválido — próximo provedor`);
      continue;
    }

    const resposta = data?.choices?.[0]?.message?.content?.trim();
    if (!resposta) {
      console.warn(`[${provedor.nome}/${result.modelId}] resposta vazia — próximo provedor`);
      continue;
    }

    return { ok: true, resposta, fonte: provedor.nome, modeloUsado: result.modelId };
  }

  return { ok: false, rateLimit: todosRateLimit };
}

// ── Handler principal ─────────────────────────────────────────────────────────
export default {
  async fetch(request, env) {

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cabecalhos() });
    }

    if (request.method !== "POST") {
      return responderErro("Método não permitido.", 405);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return responderErro("JSON inválido na requisição.", 400);
    }

    const pergunta     = (body.pergunta     ?? "").trim();
    const contexto     = (body.contexto     ?? "").trim();
    const historico    = Array.isArray(body.historico) ? body.historico : [];
    const tipoContexto = (body.tipoContexto ?? "conteudo").trim();
    const disciplina   = (body.disciplina   ?? "").trim();
    const ehQuestao    = body.ehQuestao === true;

    if (pergunta.length < 3)    return responderErro("Pergunta muito curta (mín. 3 caracteres).", 400);
    if (pergunta.length > 500)  return responderErro("Pergunta muito longa (máx. 500 caracteres).", 400);
    if (contexto.length > 4500) return responderErro("Contexto muito longo (máx. 4500 caracteres).", 400);

    if (!env.API_KEY_GROQ) {
      return responderErro("Chave Groq não configurada.", 500);
    }

    // Seleciona system prompt
    const systemPrompt = (tipoContexto === 'estrutura') ? SYSTEM_NAVEGACAO : SYSTEM_TUTOR;

    // Monta mensagens
    const mensagens = [{ role: "system", content: systemPrompt }];

    for (const turno of historico) {
      if (
        turno &&
        (turno.role === "user" || turno.role === "assistant") &&
        typeof turno.content === "string" &&
        turno.content.trim().length > 0
      ) {
        mensagens.push({ role: turno.role, content: turno.content.trim() });
      }
    }

    const rotulo = (tipoContexto === 'estrutura')
      ? 'Mapa da disciplina (aulas em sequência):'
      : 'Fatos de referência:';

    const userMessage = contexto
      ? `${rotulo}\n${contexto}\n\nPergunta do aluno: ${pergunta}`
      : `Pergunta do aluno: ${pergunta}`;

    mensagens.push({ role: "user", content: userMessage });

    // Executa cascata
    const cascata   = _montarCascata(tipoContexto, env);
    const resultado = await _chamarEmCascata(cascata, mensagens);

    if (!resultado.ok) {
      if (resultado.rateLimit) {
        return responderErro("⚠️ Muitas perguntas agora 😅 Tente novamente em alguns segundos.", 429);
      }
      return responderErro("Não foi possível obter resposta da IA. Tente novamente.", 502);
    }

    const modeloLabel = _labelModelo(resultado.modeloUsado);

    console.info(
      `[Nexus] respondido via ${resultado.fonte} (${modeloLabel})` +
      ` | tipo: ${tipoContexto}` +
      (disciplina ? ` | disc: ${disciplina}` : "") +
      (ehQuestao  ? " | ehQuestao: true" : "")
    );

    return new Response(
      JSON.stringify({ resposta: resultado.resposta, fonte: resultado.fonte, modelo: modeloLabel }),
      { status: 200, headers: cabecalhos() }
    );
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function cabecalhos() {
  return {
    "Content-Type":                 "application/json",
    "Access-Control-Allow-Origin":  "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function responderErro(mensagem, status = 500) {
  return new Response(JSON.stringify({ erro: mensagem }), { status, headers: cabecalhos() });
}