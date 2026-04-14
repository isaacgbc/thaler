import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY is not set. Add it to .env.local");
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

export const EXECUTOR_MODEL = "claude-haiku-4-5";
export const ADVISOR_MODEL = "claude-opus-4-6";
export const FALLBACK_MODEL = "claude-sonnet-4-6";

export const ADVISOR_BETA = "advisor-tool-2026-03-01";

// Signals that an error is likely caused by the advisor beta not being
// available on the account / beta not recognised by the API.
function isAdvisorIncompatibility(err: unknown): boolean {
  const e = err as any;
  const status = e?.status ?? e?.response?.status;
  const msg = (e?.message ?? "").toString().toLowerCase();
  if (status === 400 || status === 403 || status === 404) {
    if (
      msg.includes("advisor") ||
      msg.includes("beta") ||
      msg.includes("unknown tool") ||
      msg.includes("invalid_request") ||
      msg.includes("not supported") ||
      msg.includes("not available")
    ) {
      return true;
    }
  }
  return false;
}

export const ANALYTICAL_STANDARDS = `
ANALYTICAL STANDARDS (MANDATORY — these override any impulse to sound consultative or positive):

RULE 1 — ARGUE, DON'T DESCRIBE.
Every claim must combine (a) the framework that generates it, (b) the sourced data that supports it, (c) the implication for THIS business. No floating adjectives.
Bad: "Azos operates in a favorable macro environment."
Good: "Selic at 14.75% implies a real rate of 10.6% (Fisher Effect: 14.75 - 4.14 IPCA = 10.61, source: BCB + IBGE, March 2026). At this level, consumer credit historically contracts 2-3% (BCB credit cycle data 2015-2023). Azos needs credit expansion to grow. The bet is that 275bp of cuts materialize by December. If they don't, origination stalls."

RULE 2 — STEEL-MAN THE COUNTER-ARGUMENT.
For every positive finding, explicitly ask "what would make this wrong?" and answer it in the same paragraph. No finding ships without its own rebuttal.
Bad: "Demand is validated with 100K paying customers."
Good: "100K paying customers validates willingness-to-pay at current premiums. Counter-argument: 100K in a 210M population (0.05% penetration) could reflect early-adopter bias, not mass-market demand. The next 400K customers (lower income, lower digital literacy) may not convert at the same CAC. Reclame Aqui 9.5/10 reflects self-selected digital-native users, not the expansion demographic."

RULE 3 — QUANTIFY OR QUALIFY.
Never use "significant", "substantial", "considerable", "strong", "growing" without a number, unit, time window, and source. If you don't have the number, write "data insufficient" — never a vague adjective.
- "Growing market" → "market growing at X% CAGR (source, year)" or "data insufficient on CAGR"
- "Competitive advantage" → specify replication time in months and cost in USD
- "Long sales cycle" → specify days with a sourced benchmark

RULE 4 — CITE THEORY ONLY WHEN IT CHANGES THE CONCLUSION.
Do not cite academic frameworks as decoration. Cite them only when the framework predicts a specific, contrarian behavior that CONTRADICTS the company's current strategy or a naive reading of the data. If the theory merely confirms the obvious, skip the citation.
Bad: "According to Prospect Theory (Kahneman & Tversky, 1979), losses are weighted 2.25x more than gains."
Good: "The company frames its pitch as 'save money' (gain frame). Prospect Theory (Kahneman & Tversky, 1979) predicts this underperforms loss-framed copy by 25-35% because the 2.25x loss-aversion coefficient is the dominant driver in this category. Specific recommendation: A/B test a loss-frame landing page within 30 days."

RULE 5 — DISAGREE WITH OTHER AGENTS AND WITH CONSENSUS.
Real analysis has tension. If every lens agrees, something is wrong — you are pattern-matching, not analyzing. The Monte Carlo simulator must flag contradictions across agent inputs. The Moat lens must challenge the Demand lens's optimism. The Sales lens must challenge the Macro lens's assumptions about credit expansion. If you find yourself agreeing with the business owner's framing, stop and ask which assumption they most want to be true — then attack it first.

RULE 6 — SOURCES OR SILENCE.
- If web_search returns no usable data for a claim, write "no data found" — never an estimate in disguise.
- Every statistic needs an inline (source, date). "Inflation at 4.2%" is wrong; "inflation at 4.2% (source: IBGE IPCA, March 2026)" is right.
- Never write "studies show" or "industry benchmarks suggest" without naming the specific study or benchmark (e.g., "OpenView SaaS Benchmarks 2025", "Bridge Group SDR Metrics 2024").
- Competitor names come ONLY from web_search results. If search returns nothing, write "no direct competitor identified in search" — never fabricate a name.

RULE 7 — THE VERDICT MUST BE FALSIFIABLE.
State the verdict as a testable hypothesis with explicit IF/THEN conditions. Identify which assumption is most fragile and why.
Bad: "The company has strong demand."
Good: "The company survives 18 months IF (a) churn stays below 7%/month, (b) Selic cuts reach 200bp+ by Q4 2026, (c) the underwriter doesn't renegotiate MGA terms. If any fail, survival drops below 50%. Most fragile: (c) — zero contractual leverage is documented publicly."

TONE: You are an economist stress-testing a business, not a consultant pitching the founder. The goal is to be USEFUL, not likable. A finding that makes the founder uncomfortable and correct is more valuable than one that makes them comfortable and wrong.
`;

export const ANTI_HALLUCINATION_RULES = `
ANTI-HALLUCINATION RULES (MANDATORY):
1. If you cannot find real data via web_search, say "insufficient data for this variable" instead of inventing numbers. Never fabricate statistics.
2. Every data point must have a source. Format: "inflation at 4.2% (source: BCRA, March 2026)". If you cannot cite a source, do not include the data point.
3. Academic citations must be real: author, year, actual paper title. The frameworks provided in your system prompt are your verified citations. Do not add others unless you can verify them via web_search.
4. Competitor names must come from web_search results. Do not invent company names. If you find no competitors, say "no direct competitors identified in search" rather than fabricating names.
5. When estimating (as opposed to citing data), explicitly label it: "estimated based on [benchmark/comparable]" so the user knows it's a projection, not a fact.

OUTPUT PROTOCOL:
- Return ONLY a single valid JSON object matching the schema described above.
- No preamble, no markdown code fences, no trailing commentary.
- Use double quotes on every key and string value.
- If a field is unknown, use an empty string, null, or the literal string "insufficient data" — NEVER fabricate.
- CRITICAL: Even if the business description is vague or you have limited data, you MUST still return a complete JSON object conforming to the schema. Fill uncertain string fields with "insufficient data — [brief reason]" and uncertain numbers with your best sourced estimate labeled in an adjacent string field. NEVER respond with free-form prose asking for more info.
- ALL output text (verdicts, findings, descriptions, recommendations, citations) MUST be in English, even if the business description is provided in another language. Proper nouns (company names, city names, regulatory bodies like SAT/BCRA) keep their original spelling.
`;

export interface ToolConfig {
  webSearch?: boolean;
  advisor?: boolean;
}

export function buildTools(cfg: ToolConfig = {}) {
  const tools: any[] = [];
  if (cfg.webSearch !== false) {
    tools.push({
      type: "web_search_20250305",
      name: "web_search",
      max_uses: 3,
    });
  }
  if (cfg.advisor !== false) {
    tools.push({
      type: "advisor_20260301",
      name: "advisor",
      model: ADVISOR_MODEL,
    });
  }
  return tools;
}

export function buildBetas(cfg: ToolConfig = {}): string[] {
  const betas: string[] = [];
  if (cfg.advisor !== false) betas.push(ADVISOR_BETA);
  return betas;
}

const JSON_FENCE = /```(?:json)?\s*([\s\S]*?)```/i;

// Find the matching closing brace for the opening brace at `start`, respecting
// strings and escaped characters. Returns -1 if not found.
function findBalancedBrace(text: string, start: number): number {
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (c === "\\") {
      escape = true;
      continue;
    }
    if (c === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function cleanJSON(slice: string): string {
  return slice
    .replace(/,\s*([}\]])/g, "$1")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
}

export function extractJSON<T = unknown>(text: string): T {
  const fenced = text.match(JSON_FENCE);
  const candidate = (fenced ? fenced[1] : text).trim();
  const firstBrace = candidate.indexOf("{");
  if (firstBrace === -1) {
    throw new Error(
      `No JSON object found in model output:\n${text.slice(0, 500)}`
    );
  }

  // Try balanced-brace slice first — handles trailing prose.
  const balancedEnd = findBalancedBrace(candidate, firstBrace);
  if (balancedEnd !== -1) {
    const slice = candidate.slice(firstBrace, balancedEnd + 1);
    try {
      return JSON.parse(slice) as T;
    } catch {
      try {
        return JSON.parse(cleanJSON(slice)) as T;
      } catch {
        /* fall through */
      }
    }
  }

  // Fall back to lastIndexOf — handles unbalanced braces inside strings.
  const lastBrace = candidate.lastIndexOf("}");
  if (lastBrace === -1 || lastBrace < firstBrace) {
    throw new Error(
      `No JSON object found in model output:\n${text.slice(0, 500)}`
    );
  }
  const slice2 = candidate.slice(firstBrace, lastBrace + 1);
  try {
    return JSON.parse(slice2) as T;
  } catch (err) {
    try {
      return JSON.parse(cleanJSON(slice2)) as T;
    } catch (err2) {
      const msg = err2 instanceof Error ? err2.message : String(err2);
      throw new Error(
        `JSON parse failed (${msg}). First 300 chars:\n${slice2.slice(0, 300)}`
      );
    }
  }
}

export interface ExecuteArgs {
  systemPrompt: string;
  userMessage: string;
  tools?: ToolConfig;
  maxTokens?: number;
}

async function callOnce(opts: {
  model: string;
  systemPrompt: string;
  userMessage: string;
  tools: any[];
  betas: string[];
  maxTokens: number;
}) {
  const anthropic = getClient();
  const params: any = {
    model: opts.model,
    max_tokens: opts.maxTokens,
    system: opts.systemPrompt,
    tools: opts.tools.length ? opts.tools : undefined,
    messages: [{ role: "user", content: opts.userMessage }],
  };
  const reqOpts: any = opts.betas.length
    ? { headers: { "anthropic-beta": opts.betas.join(",") } }
    : {};
  return anthropic.messages.create(params, reqOpts);
}

export interface ExecuteResult<T> {
  data: T;
  text: string;
  usedFallback: boolean;
  partial: boolean;
  rawText?: string;
  parseError?: string;
}

export async function executeAgent<T>({
  systemPrompt,
  userMessage,
  tools = {},
  maxTokens = 4096,
}: ExecuteArgs): Promise<ExecuteResult<T>> {
  const wantsAdvisor = tools.advisor !== false;
  const primaryTools = buildTools(tools);
  const primaryBetas = buildBetas(tools);

  let response: any;
  let usedFallback = false;

  try {
    response = await callOnce({
      model: EXECUTOR_MODEL,
      systemPrompt,
      userMessage,
      tools: primaryTools,
      betas: primaryBetas,
      maxTokens,
    });
  } catch (err) {
    if (wantsAdvisor && isAdvisorIncompatibility(err)) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(
        `[thaler] advisor beta failed (${msg}); falling back to ${FALLBACK_MODEL} without advisor`
      );
      const fallbackTools = buildTools({ ...tools, advisor: false });
      const fallbackBetas = buildBetas({ ...tools, advisor: false });
      response = await callOnce({
        model: FALLBACK_MODEL,
        systemPrompt,
        userMessage,
        tools: fallbackTools,
        betas: fallbackBetas,
        maxTokens,
      });
      usedFallback = true;
    } else {
      throw err;
    }
  }

  const text = response.content
    .filter((b: any) => b.type === "text")
    .map((b: any) => b.text)
    .join("\n")
    .trim();

  if (!text) {
    throw new Error("Model returned no text content");
  }

  try {
    const data = extractJSON<T>(text);
    return { data, text, usedFallback, partial: false };
  } catch (err) {
    const parseError = err instanceof Error ? err.message : String(err);
    console.warn(
      `[thaler] JSON parse failed, asking model to repair. error=${parseError}`
    );
    // Repair pass: send bad output back and ask for JSON.
    try {
      const anthropic = getClient();
      const repair = await anthropic.messages.create({
        model: EXECUTOR_MODEL,
        max_tokens: maxTokens,
        system:
          "You are a JSON formatter. The user will paste text that is meant to be a single JSON object but is malformed or wrapped in prose. Extract the JSON object, fix syntax errors, and output ONLY valid JSON — no markdown fences, no commentary. Preserve all factual content; do not add new data.",
        messages: [
          {
            role: "user",
            content: `Reformat the following into a single valid JSON object. Output ONLY the JSON.\n\n---\n${text}\n---`,
          },
        ],
      });
      const repairedText = repair.content
        .filter((b: any) => b.type === "text")
        .map((b: any) => b.text)
        .join("\n")
        .trim();
      const data = extractJSON<T>(repairedText);
      return { data, text: repairedText, usedFallback, partial: false };
    } catch (repairErr) {
      // Repair also failed — return a partial result with the raw prose.
      const repairMsg =
        repairErr instanceof Error ? repairErr.message : String(repairErr);
      console.warn(
        `[thaler] JSON repair also failed (${repairMsg}); returning partial result`
      );
      return {
        data: {} as T,
        text,
        usedFallback,
        partial: true,
        rawText: text,
        parseError: `${parseError} | repair: ${repairMsg}`,
      };
    }
  }
}
