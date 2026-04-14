import { NextRequest, NextResponse } from "next/server";
import { runMonteCarloAgent } from "@/lib/agents/monteCarlo";
import { runMacroAgent } from "@/lib/agents/macro";
import { runDemandAgent } from "@/lib/agents/demand";
import { runMoatAgent } from "@/lib/agents/moat";
import { runSalesAgent } from "@/lib/agents/sales";
import { runBehavioralAgent } from "@/lib/agents/behavioral";
import { runAIDisruptionAgent } from "@/lib/agents/aiDisruption";
import { runFounderAgent } from "@/lib/agents/founder";
import type { AgentId, AgentResult, StressReport } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 300;

function computeOverallScore(
  results: Partial<Record<AgentId, AgentResult>>
): number {
  const mc = results.monte_carlo as any;
  if (mc && typeof mc.overall_score === "number") {
    return Math.max(0, Math.min(100, Math.round(mc.overall_score)));
  }
  // Fallback: 50 + sum of survival modifiers
  const base = 50;
  const modifiers = Object.values(results)
    .map((r: any) => r?.survival_modifier ?? 0)
    .reduce((a: number, b: number) => a + b, 0);
  return Math.max(0, Math.min(100, Math.round(base + modifiers)));
}

async function parseBody(req: NextRequest): Promise<{
  input: string;
  mode: "single" | "full";
  diagnostics: Record<string, unknown>;
}> {
  const contentType = req.headers.get("content-type") ?? "";
  let raw = "";
  try {
    raw = await req.text();
  } catch (err) {
    return {
      input: "",
      mode: "full",
      diagnostics: {
        contentType,
        parseError: err instanceof Error ? err.message : String(err),
      },
    };
  }

  let parsed: any = {};
  if (raw.trim().startsWith("{")) {
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {};
    }
  }

  // Accept multiple key names so different clients / curl tests work.
  const candidates = [
    parsed.input,
    parsed.businessInput,
    parsed.description,
    parsed.text,
    parsed.prompt,
    // Also accept a plain string body (e.g. `curl -d "..."` without JSON).
    !Object.keys(parsed).length ? raw : undefined,
  ];
  const picked =
    candidates.find((c) => typeof c === "string" && c.trim().length > 0) ?? "";
  const input = String(picked).trim();

  const mode: "single" | "full" =
    parsed.mode === "single" ? "single" : "full";

  return {
    input,
    mode,
    diagnostics: {
      contentType,
      rawLength: raw.length,
      inputLength: input.length,
      receivedKeys: Object.keys(parsed),
    },
  };
}

export async function POST(req: NextRequest) {
  const start = Date.now();
  try {
    const { input: businessInput, mode, diagnostics } = await parseBody(req);

    if (!businessInput || businessInput.length < 20) {
      console.warn("[thaler] /api/analyze rejected input:", diagnostics);
      return NextResponse.json(
        {
          error: "Business description must be at least 20 characters.",
          diagnostics,
        },
        { status: 400 }
      );
    }

    if (mode === "single") {
      // Smoke test path: Monte Carlo alone
      const mc = await runMonteCarloAgent({ businessInput });
      return NextResponse.json({
        mode,
        result: mc,
        latency_ms: Date.now() - start,
      });
    }

    // Full mode — 7 agents in parallel, then Monte Carlo with their outputs.
    const parallel: Array<[AgentId, Promise<AgentResult>]> = [
      ["macro", runMacroAgent(businessInput)],
      ["demand", runDemandAgent(businessInput)],
      ["moat", runMoatAgent(businessInput)],
      ["sales", runSalesAgent(businessInput)],
      ["behavioral", runBehavioralAgent(businessInput)],
      ["ai_disruption", runAIDisruptionAgent(businessInput)],
      ["founder", runFounderAgent(businessInput)],
    ];

    const settled = await Promise.allSettled(parallel.map(([, p]) => p));
    const results: Partial<Record<AgentId, AgentResult>> = {};
    const errors: Partial<Record<AgentId, string>> = {};

    settled.forEach((r, i) => {
      const id = parallel[i][0];
      if (r.status === "fulfilled") {
        results[id] = r.value;
      } else {
        const msg =
          r.reason instanceof Error ? r.reason.message : String(r.reason);
        errors[id] = msg;
        console.error(`[thaler] agent ${id} failed:`, msg);
      }
    });

    // Feed downstream MC with whatever succeeded.
    let mcResult;
    try {
      mcResult = await runMonteCarloAgent({
        businessInput,
        upstreamAgents: results as Record<string, unknown>,
      });
      results.monte_carlo = mcResult;
    } catch (err) {
      errors.monte_carlo = err instanceof Error ? err.message : String(err);
      console.error("[thaler] monte carlo failed:", errors.monte_carlo);
    }

    const report: StressReport = {
      business_input: businessInput,
      generated_at: new Date().toISOString(),
      results,
      errors,
      overall_score: computeOverallScore(results),
      latency_ms: Date.now() - start,
    };

    return NextResponse.json(report);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[thaler] /api/analyze fatal:", message);
    return NextResponse.json(
      { error: message, latency_ms: Date.now() - start },
      { status: 500 }
    );
  }
}
