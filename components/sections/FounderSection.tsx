"use client";

import type { FounderResult } from "@/lib/types";
import { CollapsibleCard } from "../CollapsibleCard";
import { stripCiteTags } from "@/lib/format";

function tone(score: number): "cyan" | "warn" | "bad" | "good" {
  if (score >= 75) return "good";
  if (score >= 55) return "cyan";
  if (score >= 35) return "warn";
  return "bad";
}

export function FounderSection({ data }: { data: FounderResult }) {
  const ft = tone(data.score);
  return (
    <CollapsibleCard
      id="founder"
      headline={`${data.score}`}
      headlineTone={ft}
      verdict={data.verdict}
      survivalModifier={data.survival_modifier}
      elapsedMs={data.elapsed_ms}
      partial={data.partial}
      rawText={data.rawText}
    >
      <p className="citation mt-3 mb-5">{stripCiteTags(data.citation)}</p>

      <div className="grid md:grid-cols-3 gap-3 mb-5">
        <SubScore label="Founder-problem fit" score={data.founder_problem_fit?.score ?? 0} weight="40%" />
        <SubScore label="Execution evidence" score={data.execution_evidence?.score ?? 0} weight="35%" />
        <SubScore label="Industry depth" score={data.industry_depth?.score ?? 0} weight="25%" />
      </div>

      {data.founder_problem_fit && (
        <Block label="Founder-problem fit — evidence" body={data.founder_problem_fit.evidence} />
      )}
      {data.founder_problem_fit?.gap && (
        <Block label="Gap" body={data.founder_problem_fit.gap} tone="warn" />
      )}

      {data.execution_evidence && (
        <div className="grid md:grid-cols-2 gap-3 mb-3">
          <Block label="Previous ventures" body={data.execution_evidence.previous_ventures} />
          <Block label="Shipping speed" body={data.execution_evidence.shipping_speed} />
        </div>
      )}

      {data.industry_depth && (
        <div className="grid md:grid-cols-2 gap-3 mb-3">
          <Block
            label={`Years in domain${data.industry_depth.years_in_domain ? ` — ${data.industry_depth.years_in_domain}` : ""}`}
            body={data.industry_depth.key_relationships}
          />
          <Block label="Regulatory navigation" body={data.industry_depth.regulatory_navigation} />
        </div>
      )}

      {data.team_composition && (
        <Block label="Team composition" body={data.team_composition} />
      )}

      {data.red_flags && data.red_flags.length > 0 && (
        <div className="border-l-2 border-danger/60 pl-4 py-2 bg-danger/5 rounded-sharp mt-3">
          <div className="text-[10px] uppercase tracking-[0.15em] text-danger font-data mb-2">
            Red flags
          </div>
          <ul className="space-y-1.5">
            {data.red_flags.map((rf, i) => (
              <li key={i} className="text-[13px] text-text-body leading-relaxed">
                — {stripCiteTags(rf)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </CollapsibleCard>
  );
}

function SubScore({ label, score, weight }: { label: string; score: number; weight: string }) {
  const t = tone(score);
  const color =
    t === "good" ? "text-positive" : t === "cyan" ? "text-cyan" : t === "warn" ? "text-warning" : "text-danger";
  return (
    <div className="bg-bg-elevated border border-border-subtle p-4 rounded-sharp">
      <div className="text-[10px] uppercase tracking-[0.15em] text-text-muted font-data">
        {label}
      </div>
      <div className={`font-data tabular-nums text-[28px] leading-none mt-2 ${color}`}>
        {Math.round(score)}
      </div>
      <div className="text-[10px] text-text-muted font-sans mt-1">Weight {weight}</div>
    </div>
  );
}

function Block({ label, body, tone = "neutral" }: { label: string; body?: string; tone?: "neutral" | "warn" }) {
  if (!body) return null;
  const borderCls = tone === "warn" ? "border-warning/50" : "border-border-subtle";
  return (
    <div className={`bg-bg-elevated border ${borderCls} p-4 rounded-sharp mb-3`}>
      <div className="text-[10px] uppercase tracking-[0.15em] text-text-muted font-data mb-2">
        {label}
      </div>
      <p className="text-[13px] text-text-body leading-relaxed">{stripCiteTags(body)}</p>
    </div>
  );
}
