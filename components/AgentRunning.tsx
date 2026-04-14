"use client";

import { AGENT_META, AgentId, StressReport } from "@/lib/types";

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

export function AgentRunning({ loading, report, elapsedMs }: Props) {
  if (!loading && !report) return null;

  const done = AGENT_ORDER.filter((id) => report?.results?.[id]).length;

  return (
    <section className="relative px-6 py-20 border-t border-border-subtle bg-bg-void">
      <div className="max-w-[720px] mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <h2 className="font-display text-[36px] md:text-[44px] text-text-primary leading-[1.05] tracking-[-0.015em]">
              {loading
                ? "Running the analysis."
                : "Analysis complete."}
            </h2>
            <p className="mt-3 text-[16px] text-text-secondary leading-[1.6] max-w-[55ch]">
              {loading
                ? "Seven independent economic lenses, each searching the web for real-time data on your specific country and sector."
                : "Below: the four headline numbers, then each lens in detail."}
            </p>
          </div>
          {loading && (
            <div className="text-right">
              <div className="font-display text-[32px] text-cyan leading-none tabular-nums">
                {(elapsedMs / 1000).toFixed(0)}s
              </div>
              <div className="text-[13px] text-text-muted mt-1">
                {done} of 7 done
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {AGENT_ORDER.map((id) => {
            const meta = AGENT_META[id];
            const ok = report?.results?.[id];
            const err = report?.errors?.[id];
            const isDone = Boolean(ok);
            const isError = Boolean(err);
            const isRunning = loading && !isDone && !isError;

            return (
              <div
                key={id}
                className={`rounded-sharp border-l-2 p-4 transition-colors ${
                  isDone
                    ? "bg-bg-surface border border-border-subtle border-l-positive"
                    : isError
                    ? "bg-bg-surface border border-border-subtle border-l-danger"
                    : "agent-loading border-l-cyan"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-sans font-medium text-[15px] text-text-primary truncate">
                    {meta.name}
                  </span>
                  <div className="flex items-center gap-3 text-[13px]">
                    {isDone && <span className="text-positive">Done</span>}
                    {isError && <span className="text-danger">Failed</span>}
                    {isRunning && (
                      <span className="text-cyan animate-pulse">
                        Analyzing…
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
