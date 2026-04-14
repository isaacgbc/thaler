"use client";

import type { DemandResult } from "@/lib/types";
import { CollapsibleCard } from "../CollapsibleCard";
import { stripCiteTags } from "@/lib/format";

const LEVEL_TONE = {
  validated: "good",
  probable: "cyan",
  uncertain: "warn",
  weak: "bad",
} as const;

export function DemandSection({ data }: { data: DemandResult }) {
  const tone =
    LEVEL_TONE[data.demand_level as keyof typeof LEVEL_TONE] ?? "neutral";

  return (
    <CollapsibleCard
      id="demand"
      headline={(data.demand_level ?? "—").toUpperCase()}
      headlineTone={tone}
      verdict={data.verdict}
      survivalModifier={data.survival_modifier}
      elapsedMs={data.elapsed_ms}
      partial={data.partial}
      rawText={data.rawText}
    >
      <p className="citation mt-3 mb-5">{stripCiteTags(data.citation)}</p>

      {data.job_to_be_done && (
        <div className="bg-bg-elevated border border-border-subtle p-4 rounded-sharp mb-4">
          <div className="text-[10px] uppercase tracking-[0.15em] text-text-muted font-data mb-3">
            Job-to-be-Done (Christensen)
          </div>
          <dl className="space-y-2 text-[13px]">
            {(["functional", "social", "emotional"] as const).map((k) => (
              <div key={k} className="grid grid-cols-[90px_1fr] gap-3">
                <dt className="text-text-muted font-data text-[10px] uppercase tracking-wider pt-1">
                  {k}
                </dt>
                <dd className="text-text-secondary leading-relaxed">
                  {stripCiteTags(data.job_to_be_done?.[k] ?? "")}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {data.social_evidence?.length > 0 && (
        <div className="space-y-2 mb-4">
          <div className="text-[10px] uppercase tracking-[0.15em] text-text-muted font-data">
            Social evidence
          </div>
          {data.social_evidence.map((e, i) => {
            const c =
              e.sentiment === "positive"
                ? "border-l-positive"
                : e.sentiment === "negative"
                ? "border-l-danger"
                : "border-l-warning";
            return (
              <div key={i} className={`border-l-2 ${c} pl-4 py-2`}>
                <p className="text-[13px] text-text-primary leading-relaxed">
                  {stripCiteTags(e.finding)}
                </p>
                <p className="mt-1 text-[10px] text-text-muted font-data uppercase tracking-wider">
                  {e.source} · {e.volume}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {data.unmet_needs?.length > 0 && (
        <div className="bg-bg-elevated border border-border-subtle p-4 rounded-sharp">
          <div className="text-[10px] uppercase tracking-[0.15em] text-text-muted font-data mb-2">
            Unmet needs
          </div>
          <ul className="space-y-1.5 text-[13px] text-text-secondary leading-relaxed">
            {data.unmet_needs.map((n, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-text-muted">—</span>
                <span>{stripCiteTags(n)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </CollapsibleCard>
  );
}
