"use client";

import type { BehavioralResult } from "@/lib/types";
import { CollapsibleCard } from "../CollapsibleCard";
import { stripCiteTags } from "@/lib/format";

export function BehavioralSection({ data }: { data: BehavioralResult }) {
  const p = data.pricing_analysis ?? ({} as BehavioralResult["pricing_analysis"]);
  const hasReframe = Boolean(data.gtm_reframe);
  return (
    <CollapsibleCard
      id="behavioral"
      headline={hasReframe ? "REFRAME →" : "—"}
      headlineTone="cyan"
      verdict={data.verdict}
      survivalModifier={data.survival_modifier}
      elapsedMs={data.elapsed_ms}
      partial={data.partial}
      rawText={data.rawText}
    >
      <p className="citation mt-3 mb-5">{stripCiteTags(data.citation)}</p>

      {hasReframe && (
        <div className="border border-cyan/40 bg-bg-elevated p-4 rounded-sharp mb-5">
          <div className="text-[10px] uppercase tracking-[0.15em] text-cyan font-data mb-2">
            Single most impactful GTM reframe
          </div>
          <p className="text-[14px] text-text-primary leading-relaxed">
            {stripCiteTags(data.gtm_reframe)}
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-3 mb-4">
        <PBlock label="Reference point" body={p.current_reference_point} />
        <PBlock label="Loss-frame opportunity" body={p.loss_frame_opportunity} />
        <PBlock label="Anchoring" body={p.anchoring_effectiveness} />
        <PBlock label="Decoy opportunity" body={p.decoy_opportunity} />
        <div className="md:col-span-2">
          <PBlock label="Friction map" body={p.friction_map} />
        </div>
      </div>

      {data.behavioral_insights?.length > 0 && (
        <div className="space-y-2 mb-4">
          <div className="text-[10px] uppercase tracking-[0.15em] text-text-muted font-data">
            Biases applied
          </div>
          {data.behavioral_insights.map((b, i) => (
            <div key={i} className="border-l-2 border-l-theory pl-4 py-2">
              <p className="text-[13px] text-text-primary leading-relaxed">
                {stripCiteTags(b.application)}
              </p>
              <p className="mt-1 text-[10px] text-text-muted font-data uppercase tracking-wider">
                {b.bias} · {b.expected_impact}
              </p>
            </div>
          ))}
        </div>
      )}

      {data.latam_specific && (
        <PBlock label="LATAM-specific" body={data.latam_specific} />
      )}
    </CollapsibleCard>
  );
}

function PBlock({ label, body }: { label: string; body?: string }) {
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
