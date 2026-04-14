"use client";

import type {
  StressReport,
  MonteCarloResult,
  MoatResult,
  SalesResult,
  DemandResult,
} from "@/lib/types";
import { MetricCard } from "./MetricCard";
import { scoreTone } from "@/lib/format";

const DEMAND_LABEL: Record<string, string> = {
  validated: "Validated",
  probable: "Probable",
  uncertain: "Uncertain",
  weak: "Weak",
};

export function Dashboard({ report }: { report: StressReport }) {
  const mc = report.results.monte_carlo as MonteCarloResult | undefined;
  const moat = report.results.moat as MoatResult | undefined;
  const sales = report.results.sales as SalesResult | undefined;
  const demand = report.results.demand as DemandResult | undefined;

  const survival =
    mc?.survival_rate_pct != null ? Math.round(mc.survival_rate_pct) : null;
  const survivalTone = survival != null ? scoreTone(survival) : "warn";

  const moatScore =
    moat?.moat_score != null ? Math.round(moat.moat_score) : null;
  const moatTone = (() => {
    if (moatScore == null) return "warn";
    if (moatScore >= 70) return "good";
    if (moatScore >= 40) return "cyan";
    return "bad";
  })();

  const ltvCac = sales?.metrics?.ltv_cac_ratio;
  const ltvCacTone = (() => {
    if (ltvCac == null) return "warn";
    if (ltvCac >= 3) return "good";
    if (ltvCac >= 1.5) return "warn";
    return "bad";
  })();

  const demandTone = (() => {
    switch (demand?.demand_level) {
      case "validated":
        return "good";
      case "probable":
        return "cyan";
      case "uncertain":
        return "warn";
      case "weak":
        return "bad";
      default:
        return "neutral";
    }
  })();

  return (
    <section
      id="dashboard"
      className="relative px-6 py-20 border-t border-border-subtle bg-bg-void"
    >
      <div className="max-w-[720px] mx-auto">
        <h2 className="font-display text-[36px] md:text-[44px] text-text-primary leading-[1.05] tracking-[-0.015em] mb-3">
          At a glance.
        </h2>
        <p className="text-[17px] text-text-secondary leading-[1.6] mb-10 max-w-[55ch]">
          Four numbers tell the whole story. Tap any card below for the reasoning.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard
            label="Survival"
            value={survival != null ? `${survival}%` : "—"}
            tone={survivalTone}
            size="lg"
            progress={survival ?? 0}
            hint="Chance of surviving 18 months across 1,000 simulations."
          />
          <MetricCard
            label="Defensibility"
            value={moatScore != null ? `${moatScore}/100` : "—"}
            tone={moatTone as any}
            size="lg"
            progress={moatScore ?? 0}
            hint="How hard is it for competitors to take this business."
          />
          <MetricCard
            label="Customer economics"
            value={ltvCac != null ? `${ltvCac.toFixed(1)}×` : "—"}
            tone={ltvCacTone}
            size="lg"
            hint="Lifetime value divided by cost to acquire. Above 3× is healthy."
          />
          <MetricCard
            label="Market demand"
            value={DEMAND_LABEL[demand?.demand_level ?? ""] ?? "—"}
            tone={demandTone as any}
            size="md"
            hint="Evidence of real customers paying, not surveys."
          />
        </div>
      </div>
    </section>
  );
}
