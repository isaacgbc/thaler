"use client";

import { formatMultiplier, stageMultiplier, type PortfolioCompany } from "@/lib/portfolio";

interface Props {
  company: PortfolioCompany;
  size?: "sm" | "lg";
}

function multiplierTone(m: number): { label: string; cls: string } {
  if (m >= 2.5) return { label: "exceptional for stage", cls: "text-positive" };
  if (m >= 1.5) return { label: "strong for stage", cls: "text-cyan" };
  if (m >= 1.1) return { label: "above stage benchmark", cls: "text-cyan" };
  if (m >= 0.9) return { label: "in line with stage", cls: "text-text-secondary" };
  return { label: "below stage benchmark", cls: "text-warning" };
}

export function StageMultiplier({ company, size = "sm" }: Props) {
  const m = stageMultiplier(company);
  const tone = multiplierTone(m);
  const large = size === "lg";

  return (
    <div className="flex flex-col items-end gap-0.5">
      <div
        className={`font-data font-semibold tabular-nums leading-none ${
          large ? "text-[22px]" : "text-[16px]"
        } ${tone.cls}`}
      >
        {formatMultiplier(m)}
      </div>
      <div
        className={`text-[9px] uppercase tracking-[0.14em] font-sans font-medium ${tone.cls} opacity-80`}
      >
        {tone.label}
      </div>
      <div className="text-[10px] text-text-muted font-mono tabular-nums">
        {company.survival_pct}% vs {company.stage_base_rate}% {company.stage_at_investment}
      </div>
    </div>
  );
}

export function StageBaseRateBar({ company }: { company: PortfolioCompany }) {
  return (
    <div className="space-y-2">
      <div>
        <div className="flex items-center justify-between text-[10px] text-text-muted font-sans mb-1">
          <span className="uppercase tracking-[0.14em]">
            {company.stage_at_investment} base rate
          </span>
          <span className="font-mono tabular-nums">{company.stage_base_rate}%</span>
        </div>
        <div className="h-1.5 bg-bg-elevated rounded-sharp overflow-hidden">
          <div
            className="h-full bg-text-muted"
            style={{ width: `${company.stage_base_rate}%` }}
          />
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between text-[10px] text-cyan font-sans mb-1">
          <span className="uppercase tracking-[0.14em]">Thaler score</span>
          <span className="font-mono tabular-nums">{company.survival_pct}%</span>
        </div>
        <div className="h-1.5 bg-bg-elevated rounded-sharp overflow-hidden">
          <div
            className="h-full bg-cyan"
            style={{ width: `${company.survival_pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
