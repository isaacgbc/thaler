"use client";

import { AgentId, StressReport } from "@/lib/types";
import { AgentStatus, AgentRunState } from "./AgentStatus";

const AGENT_ORDER: AgentId[] = [
  "macro",
  "demand",
  "moat",
  "sales",
  "behavioral",
  "ai_disruption",
  "monte_carlo",
];

interface Props {
  loading: boolean;
  report: StressReport | null;
  elapsedMs: number;
}

function stateFor(
  id: AgentId,
  loading: boolean,
  report: StressReport | null
): AgentRunState {
  if (!loading && !report) return "pending";
  if (report?.results?.[id]) return "done";
  if (report?.errors?.[id]) return "error";
  return loading ? "running" : "pending";
}

export function AgentGrid({ loading, report, elapsedMs }: Props) {
  return (
    <section
      id="agents"
      className="relative px-6 py-24 border-t border-border"
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-text-secondary mb-3">
              02 — Seven Economists Running in Parallel
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-text-primary leading-tight">
              Theory meets street meets data.
            </h2>
          </div>
          <div className="text-right font-data text-xs text-text-secondary">
            <div>
              ELAPSED{" "}
              <span className="text-accent-cyan">
                {(elapsedMs / 1000).toFixed(1)}s
              </span>
            </div>
            <div>
              EXECUTOR{" "}
              <span className="text-text-primary">claude-haiku-4-5</span>
            </div>
            <div>
              ADVISOR{" "}
              <span className="text-text-primary">claude-opus-4-6</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {AGENT_ORDER.map((id) => {
            const s = stateFor(id, loading, report);
            const result = report?.results?.[id] as any;
            return (
              <AgentStatus
                key={id}
                id={id}
                state={s}
                verdict={result?.verdict}
                error={report?.errors?.[id]}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
