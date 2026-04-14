"use client";

import type { MacroResult } from "@/lib/types";
import { CollapsibleCard } from "../CollapsibleCard";
import { stripCiteTags } from "@/lib/format";

const OUTLOOK_TONE = {
  favorable: "good",
  cautious: "cyan",
  challenging: "warn",
  hostile: "bad",
} as const;

export function MacroSection({ data }: { data: MacroResult }) {
  const tone =
    OUTLOOK_TONE[data.outlook as keyof typeof OUTLOOK_TONE] ?? "neutral";

  return (
    <CollapsibleCard
      id="macro"
      headline={(data.outlook ?? "—").toUpperCase()}
      headlineTone={tone}
      verdict={data.verdict}
      survivalModifier={data.survival_modifier}
      elapsedMs={data.elapsed_ms}
      partial={data.partial}
      rawText={data.rawText}
    >
      <p className="citation mt-3 mb-5">{stripCiteTags(data.citation)}</p>

      {data.key_findings?.length > 0 && (
        <div className="mb-5 space-y-2">
          {data.key_findings.map((f, i) => {
            const color =
              f.impact === "positive"
                ? "border-l-positive"
                : f.impact === "negative"
                ? "border-l-danger"
                : "border-l-cyan";
            return (
              <div
                key={i}
                className={`border-l-2 pl-4 py-2 ${color}`}
              >
                <p className="text-[14px] text-text-primary leading-relaxed">
                  {stripCiteTags(f.finding)}
                </p>
                {f.data_source && (
                  <p className="mt-1 text-[11px] text-text-muted font-data uppercase tracking-wider">
                    {f.data_source}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-3">
        <DetailBlock label="Inflation impact" body={data.inflation_impact} />
        <DetailBlock label="FX exposure" body={data.fx_exposure} />
        <DetailBlock label="Rate environment" body={data.rate_environment} />
        <DetailBlock label="Historical analog" body={data.historical_analog} />
      </div>
    </CollapsibleCard>
  );
}

function DetailBlock({ label, body }: { label: string; body: string }) {
  if (!body) return null;
  return (
    <div className="bg-bg-elevated border border-border-subtle p-4 rounded-sharp">
      <div className="text-[10px] uppercase tracking-[0.15em] text-text-muted font-data mb-2">
        {label}
      </div>
      <p className="text-[13px] text-text-secondary leading-relaxed">
        {stripCiteTags(body)}
      </p>
    </div>
  );
}
