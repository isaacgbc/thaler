"use client";

import type { AIDisruptionResult } from "@/lib/types";
import { CollapsibleCard } from "../CollapsibleCard";
import { stripCiteTags } from "@/lib/format";

const RISK_TONE = {
  existential: "bad",
  high: "bad",
  moderate: "warn",
  low: "cyan",
  negligible: "good",
} as const;

export function AIDisruptionSection({ data }: { data: AIDisruptionResult }) {
  const tone =
    RISK_TONE[data.disruption_risk as keyof typeof RISK_TONE] ?? "neutral";
  return (
    <CollapsibleCard
      id="ai_disruption"
      headline={(data.disruption_risk ?? "—").toUpperCase()}
      headlineTone={tone}
      verdict={data.verdict}
      survivalModifier={data.survival_modifier}
      elapsedMs={data.elapsed_ms}
      partial={data.partial}
      rawText={data.rawText}
    >
      <p className="citation mt-3 mb-5">{stripCiteTags(data.citation)}</p>

      {data.value_chain_analysis?.length > 0 && (
        <div className="bg-bg-elevated border border-border-subtle rounded-sharp mb-4">
          <div className="grid grid-cols-[1.5fr_1.5fr_60px_80px] text-[10px] uppercase tracking-[0.15em] font-data text-text-muted border-b border-border-subtle px-4 py-2.5 gap-3">
            <div>Activity</div>
            <div>AI Capability</div>
            <div>Quality</div>
            <div>Timeline</div>
          </div>
          {data.value_chain_analysis.map((v, i) => (
            <div
              key={i}
              className="grid grid-cols-[1.5fr_1.5fr_60px_80px] px-4 py-3 border-b border-border-subtle/50 last:border-b-0 gap-3 items-start"
            >
              <div className="text-[13px] text-text-primary">
                {stripCiteTags(v.activity)}
              </div>
              <div className="text-[12px] text-text-secondary leading-relaxed">
                {stripCiteTags(v.ai_capability_today)}
              </div>
              <div className="font-data text-cyan text-[13px]">{v.ai_quality_pct}%</div>
              <div className="font-data text-[11px] text-text-muted">
                {stripCiteTags(v.timeline)}
              </div>
            </div>
          ))}
        </div>
      )}

      {data.specific_threats?.length > 0 && (
        <div className="space-y-2 mb-4">
          <div className="text-[10px] uppercase tracking-[0.15em] text-text-muted font-data">
            Specific threats
          </div>
          {data.specific_threats.map((t, i) => (
            <div
              key={i}
              className={`border-l-2 pl-4 py-2 ${
                t.threat_level === "high" ? "border-l-danger" : "border-l-warning"
              }`}
            >
              <p className="text-[13px] text-text-primary leading-relaxed">
                <span className="font-data text-cyan">{t.name}</span>{" — "}
                {stripCiteTags(t.what_they_do)}
              </p>
              <p className="mt-1 text-[10px] text-text-muted font-data uppercase tracking-wider">
                {t.threat_level} · {t.source}
              </p>
            </div>
          ))}
        </div>
      )}

      {data.ai_opportunities?.length > 0 && (
        <div className="space-y-2 mb-4">
          <div className="text-[10px] uppercase tracking-[0.15em] text-text-muted font-data">
            AI opportunities (for the business itself)
          </div>
          {data.ai_opportunities.map((o, i) => (
            <div key={i} className="border-l-2 border-l-positive pl-4 py-2">
              <p className="text-[13px] text-text-primary leading-relaxed">
                {stripCiteTags(o.opportunity)}
              </p>
              <p className="mt-1 text-[10px] text-text-muted font-data uppercase tracking-wider">
                Cost: {o.implementation_cost} · Impact: {o.expected_impact}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-3">
        <Block
          label="Defensible core"
          body={data.defensible_core}
          tone="positive"
        />
        <Block
          label="Strategic recommendation"
          body={data.strategic_recommendation}
          tone="cyan"
        />
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
  body?: string;
  tone?: "cyan" | "positive";
}) {
  if (!body) return null;
  const border = tone === "cyan" ? "border-cyan/40" : "border-border-subtle";
  const titleColor = tone === "cyan" ? "text-cyan" : "text-positive";
  return (
    <div className={`bg-bg-elevated border ${border} p-4 rounded-sharp`}>
      <div
        className={`text-[10px] uppercase tracking-[0.15em] font-data mb-2 ${titleColor}`}
      >
        {label}
      </div>
      <p className="text-[13px] text-text-secondary leading-relaxed">
        {stripCiteTags(body)}
      </p>
    </div>
  );
}
