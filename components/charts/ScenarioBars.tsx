"use client";

import type { MonteCarloResult } from "@/lib/types";

const LABELS: Record<string, string> = {
  tailwind: "Best case",
  base: "Base",
  headwind: "Worst case",
  storm: "Crisis",
};

const COLORS: Record<string, string> = {
  tailwind: "var(--positive)",
  base: "var(--cyan)",
  headwind: "var(--warning)",
  storm: "var(--danger)",
};

export function ScenarioBars({ scenarios }: { scenarios: MonteCarloResult["scenarios"] }) {
  if (!scenarios) return null;
  const order = ["tailwind", "base", "headwind", "storm"] as const;

  return (
    <div className="space-y-4">
      {order.map((key) => {
        const s = scenarios[key];
        if (!s) return null;
        const pct = Math.max(0, Math.min(100, Math.round(s.survival_pct ?? 0)));
        return (
          <div
            key={key}
            className="grid grid-cols-[110px_1fr_100px] items-center gap-4"
          >
            <div className="text-[15px] text-text-primary font-sans">
              {LABELS[key]}
            </div>
            <div className="relative h-8 bg-bg-elevated rounded-sharp overflow-hidden">
              <div
                className="h-full transition-[width] duration-700 ease-out"
                style={{ width: `${pct}%`, background: COLORS[key] }}
              />
              <div
                className="absolute inset-y-0 left-3 flex items-center text-[14px] font-data font-semibold tabular-nums"
                style={{ color: pct < 20 ? "var(--text-primary)" : "var(--text-inverse)" }}
              >
                {pct}%
              </div>
            </div>
            <div className="text-[13px] text-text-muted font-sans text-right tabular-nums">
              ${Math.round((s.revenue_month12 ?? 0) / 1000).toLocaleString()}k @ M12
            </div>
          </div>
        );
      })}
    </div>
  );
}
