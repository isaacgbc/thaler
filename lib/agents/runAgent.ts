import { executeAgent, ExecuteArgs, ExecuteResult } from "../anthropic";
import type { AgentId, AgentResultBase } from "../types";

export interface WrappedResult<T> extends AgentResultBase {
  // All typed fields of T are available at runtime; we intersect them below.
  [key: string]: unknown;
}

function clampModifier(m: unknown): number {
  const n = typeof m === "number" ? m : Number(m);
  if (!Number.isFinite(n)) return 0;
  if (n > 20) return 20;
  if (n < -20) return -20;
  return Math.round(n);
}

export interface RunAgentArgs {
  id: AgentId;
  name: string;
  prompt: Omit<ExecuteArgs, never>;
}

export async function runAgent<T extends { survival_modifier?: number; verdict?: string }>(
  args: RunAgentArgs
): Promise<T & AgentResultBase> {
  const started = Date.now();
  console.log(`[thaler] agent ${args.id} started`);

  let res: ExecuteResult<T>;
  try {
    res = await executeAgent<T>(args.prompt);
  } catch (err) {
    const elapsed = Date.now() - started;
    const msg = err instanceof Error ? err.message : String(err);
    console.error(
      `[thaler] agent ${args.id} FAILED after ${elapsed}ms: ${msg}`
    );
    throw err;
  }

  const elapsed_ms = Date.now() - started;

  if (res.partial) {
    console.warn(
      `[thaler] agent ${args.id} returned PARTIAL in ${elapsed_ms}ms`
    );
    return {
      id: args.id,
      name: args.name,
      framework_applied: "",
      citation: "",
      verdict: firstSentence(res.rawText ?? "") || "Partial — model output could not be parsed as JSON.",
      survival_modifier: 0,
      partial: true,
      rawText: res.rawText,
      parseError: res.parseError,
      elapsed_ms,
    } as T & AgentResultBase;
  }

  const data: any = res.data ?? {};
  console.log(
    `[thaler] agent ${args.id} done in ${elapsed_ms}ms${
      res.usedFallback ? " (fallback)" : ""
    }`
  );

  return {
    ...data,
    id: args.id,
    name: args.name,
    survival_modifier: clampModifier(data.survival_modifier),
    elapsed_ms,
  } as T & AgentResultBase;
}

function firstSentence(s: string): string {
  const t = s.replace(/\s+/g, " ").trim();
  if (!t) return "";
  const match = t.match(/^[^.!?]{10,400}[.!?]/);
  if (match) return match[0].trim();
  return t.slice(0, 240) + (t.length > 240 ? "…" : "");
}
