"use client";

import type { SalesResult } from "@/lib/types";
import { CollapsibleCard } from "../CollapsibleCard";
import { stripCiteTags, formatUSD } from "@/lib/format";

export function SalesSection({ data }: { data: SalesResult }) {
  const m = data.metrics ?? ({} as SalesResult["metrics"]);
  const ltvCac = m.ltv_cac_ratio ?? 0;
  const tone = ltvCac >= 3 ? "good" : ltvCac >= 1.5 ? "warn" : "bad";

  return (
    <CollapsibleCard
      id="sales"
      headline={ltvCac ? `${ltvCac.toFixed(2)}x LTV/CAC` : "—"}
      headlineTone={tone}
      verdict={data.verdict}
      survivalModifier={data.survival_modifier}
      elapsedMs={data.elapsed_ms}
      partial={data.partial}
      rawText={data.rawText}
    >
      <p className="citation mt-3 mb-5">{stripCiteTags(data.citation)}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        <Stat label="ACV" value={m.estimated_acv ? formatUSD(m.estimated_acv) : "—"} />
        <Stat
          label="Sales Cycle"
          value={m.sales_cycle_days ? `${m.sales_cycle_days}d` : "—"}
        />
        <Stat label="CAC" value={m.estimated_cac ? formatUSD(m.estimated_cac) : "—"} />
        <Stat label="LTV" value={m.estimated_ltv ? formatUSD(m.estimated_ltv) : "—"} />
        <Stat
          label="CAC Payback"
          value={m.cac_payback_months ? `${m.cac_payback_months}mo` : "—"}
          tone={m.cac_payback_months != null && m.cac_payback_months <= 12 ? "good" : "warn"}
        />
        <Stat
          label="Deals for $1M ARR"
          value={m.deals_for_1m_arr != null ? m.deals_for_1m_arr.toLocaleString() : "—"}
        />
        <Stat
          label="Pipeline Req."
          value={m.pipeline_required != null ? m.pipeline_required.toLocaleString() : "—"}
        />
        <Stat
          label="Runway (cycles)"
          value={
            m.runway_in_sales_cycles != null
              ? `${m.runway_in_sales_cycles.toFixed(1)}x`
              : "—"
          }
          tone={
            m.runway_in_sales_cycles != null && m.runway_in_sales_cycles >= 3
              ? "good"
              : "warn"
          }
        />
      </div>

      {data.latam_risks?.length > 0 && (
        <div className="space-y-2 mb-4">
          <div className="text-[10px] uppercase tracking-[0.15em] text-text-muted font-data">
            LATAM-specific risks
          </div>
          {data.latam_risks.map((r, i) => (
            <div key={i} className="border-l-2 border-l-danger pl-4 py-2">
              <p className="text-[13px] text-text-primary leading-relaxed">
                {stripCiteTags(r.risk)}
              </p>
              {r.mitigation && (
                <p className="mt-1 text-[12px] text-text-muted leading-relaxed">
                  → {stripCiteTags(r.mitigation)}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {data.gtm_recommendation && (
        <div className="border border-cyan/40 bg-bg-elevated p-4 rounded-sharp">
          <div className="text-[10px] uppercase tracking-[0.15em] text-cyan font-data mb-2">
            GTM recommendation
          </div>
          <p className="text-[13px] text-text-primary leading-relaxed">
            {stripCiteTags(data.gtm_recommendation)}
          </p>
        </div>
      )}
    </CollapsibleCard>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "good" | "warn" | "bad";
}) {
  const color =
    tone === "good"
      ? "text-positive"
      : tone === "warn"
      ? "text-warning"
      : tone === "bad"
      ? "text-danger"
      : "text-text-primary";
  return (
    <div className="bg-bg-elevated border border-border-subtle p-3 rounded-sharp">
      <div className="text-[10px] uppercase tracking-[0.15em] text-text-muted font-data mb-2">
        {label}
      </div>
      <div className={`font-data font-bold text-[18px] tabular-nums ${color}`}>
        {value}
      </div>
    </div>
  );
}
