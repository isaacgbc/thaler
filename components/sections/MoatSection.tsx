"use client";

import type { MoatResult } from "@/lib/types";
import { CollapsibleCard } from "../CollapsibleCard";
import { stripCiteTags } from "@/lib/format";

const POWER_LABELS: Record<string, string> = {
  scale_economies: "Scale Economies",
  network_effects: "Network Effects",
  counter_positioning: "Counter-Positioning",
  switching_costs: "Switching Costs",
  branding: "Branding",
  cornered_resource: "Cornered Resource",
  process_power: "Process Power",
};

export function MoatSection({ data }: { data: MoatResult }) {
  const score = data.moat_score ?? 0;
  const tone = score >= 70 ? "good" : score >= 40 ? "cyan" : "bad";
  return (
    <CollapsibleCard
      id="moat"
      headline={`${score}/100`}
      headlineTone={tone}
      verdict={data.verdict}
      survivalModifier={data.survival_modifier}
      elapsedMs={data.elapsed_ms}
      partial={data.partial}
      rawText={data.rawText}
    >
      <p className="citation mt-3 mb-5">{stripCiteTags(data.citation)}</p>

      {data.powers && (
        <div className="bg-bg-elevated border border-border-subtle rounded-sharp mb-4">
          <div className="grid grid-cols-[1fr_60px_2fr] text-[10px] uppercase tracking-[0.15em] font-data text-text-muted border-b border-border-subtle px-4 py-2.5">
            <div>Power</div>
            <div>Present</div>
            <div>Quantification</div>
          </div>
          {Object.entries(data.powers).map(([key, p]: [string, any]) => {
            const details = powerDetails(key, p);
            return (
              <div
                key={key}
                className="grid grid-cols-[1fr_60px_2fr] px-4 py-3 border-b border-border-subtle/50 last:border-b-0 items-start gap-3"
              >
                <div className="text-[13px] text-text-primary">
                  {POWER_LABELS[key]}
                </div>
                <div>
                  <span
                    className={`font-data text-[11px] uppercase tracking-wider ${
                      p.present ? "text-positive" : "text-text-muted"
                    }`}
                  >
                    {p.present ? "Yes" : "No"}
                  </span>
                </div>
                <div className="text-[12px] text-text-secondary leading-relaxed">
                  {details}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-3">
        <Block label="Strongest power" body={data.strongest_power} tone="good" />
        <Block label="Weakest flank" body={data.weakest_flank} tone="warn" />
        <div className="md:col-span-2">
          <Block label="VRIO assessment (Barney)" body={data.vrio_assessment} />
        </div>
      </div>
    </CollapsibleCard>
  );
}

function Block({
  label,
  body,
  tone,
}: {
  label: string;
  body: string;
  tone?: "good" | "warn";
}) {
  if (!body) return null;
  const headerTone =
    tone === "good" ? "text-positive" : tone === "warn" ? "text-warning" : "text-text-muted";
  return (
    <div className="bg-bg-elevated border border-border-subtle p-4 rounded-sharp">
      <div className={`text-[10px] uppercase tracking-[0.15em] font-data mb-2 ${headerTone}`}>
        {label}
      </div>
      <p className="text-[13px] text-text-secondary leading-relaxed">
        {stripCiteTags(body)}
      </p>
    </div>
  );
}

function powerDetails(key: string, p: any): string {
  if (!p?.present) return "—";
  switch (key) {
    case "network_effects":
      return p.tipping_point_pct != null
        ? `${p.type ?? "network"} · at ${p.tipping_point_pct}% of tipping point`
        : "Present (magnitude unknown)";
    case "switching_costs":
      return (
        [
          p.cost_hours != null ? `${p.cost_hours}h` : null,
          p.cost_dollars != null ? `$${p.cost_dollars}` : null,
        ]
          .filter(Boolean)
          .join(" · ") || "Present"
      );
    case "branding":
      return p.premium_pct != null ? `+${p.premium_pct}% WTP premium` : "Present";
    case "cornered_resource":
      return p.resource ?? "Present";
    case "process_power":
      return p.replication_time ?? "Present";
    case "counter_positioning":
      return p.incumbent_conflict ?? "Present";
    case "scale_economies":
      return p.quantification ?? "Present";
    default:
      return "Present";
  }
}
