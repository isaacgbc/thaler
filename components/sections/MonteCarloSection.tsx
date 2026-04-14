"use client";

import type { MonteCarloResult } from "@/lib/types";
import { CollapsibleCard } from "../CollapsibleCard";
import { MonteCarloChart } from "../MonteCarloChart";
import { ScenarioBars } from "../charts/ScenarioBars";
import { stripCiteTags, scoreTone } from "@/lib/format";

export function MonteCarloSection({ data }: { data: MonteCarloResult }) {
  const survival = Math.round(data.survival_rate_pct ?? 0);
  const tone = scoreTone(survival);
  return (
    <CollapsibleCard
      id="monte_carlo"
      headline={`${survival}% survive`}
      headlineTone={tone}
      verdict={data.verdict}
      survivalModifier={data.survival_modifier}
      elapsedMs={data.elapsed_ms}
      partial={data.partial}
      rawText={data.rawText}
    >
      <div className="mb-8">
        <h4 className="font-display text-[22px] text-text-primary mb-2">
          Distribution of outcomes
        </h4>
        <p className="text-[15px] text-text-secondary leading-[1.6] max-w-[60ch] mb-4">
          One thousand simulated futures over 18 months. The dashed lines show
          where each scenario falls inside the distribution.
        </p>
        <MonteCarloChart
          data={data.histogram_data ?? []}
          scenarios={data.scenarios}
        />
      </div>

      <div className="mb-8">
        <h4 className="font-display text-[22px] text-text-primary mb-2">
          The four scenarios
        </h4>
        <p className="text-[15px] text-text-secondary leading-[1.6] max-w-[60ch] mb-5">
          Survival probability and month-12 revenue under best case, base, worst
          case, and crisis conditions.
        </p>
        <ScenarioBars scenarios={data.scenarios} />
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 mt-6">
          {(["tailwind", "base", "headwind", "storm"] as const).map((key) => {
            const s = data.scenarios?.[key];
            if (!s?.description) return null;
            const label =
              key === "tailwind"
                ? "Best case"
                : key === "base"
                ? "Base"
                : key === "headwind"
                ? "Worst case"
                : "Crisis";
            return (
              <p
                key={key}
                className="text-[14px] text-text-secondary leading-[1.6]"
              >
                <span className="text-text-primary font-medium">{label}. </span>
                {stripCiteTags(s.description)}
              </p>
            );
          })}
        </div>
      </div>

      {data.variables?.length > 0 && (
        <div>
          <h4 className="font-display text-[22px] text-text-primary mb-2">
            What matters most
          </h4>
          <p className="text-[15px] text-text-secondary leading-[1.6] max-w-[60ch] mb-4">
            Variables ranked by how much they move survival when stressed.
          </p>
          <div className="space-y-2">
            {data.variables
              .slice()
              .sort((a, b) => a.sensitivity_rank - b.sensitivity_rank)
              .map((v, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[28px_1fr_auto] gap-4 items-baseline py-2 border-b border-border-subtle/40 last:border-b-0"
                >
                  <span className="font-sans text-[14px] text-text-muted">
                    {i + 1}.
                  </span>
                  <span className="text-[15px] text-text-primary">
                    {stripCiteTags(v.name)}
                  </span>
                  <span className="font-data text-[12px] text-text-muted tabular-nums">
                    {v.pessimistic}
                    {v.unit} → {v.base}
                    {v.unit} → {v.optimistic}
                    {v.unit}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </CollapsibleCard>
  );
}
