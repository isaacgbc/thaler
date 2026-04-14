"use client";

import { useState } from "react";
import { PortfolioRadar } from "./PortfolioRadar";
import { TierBadge, TierDistributionBar } from "./TierDistributionBar";
import { StageBaseRateBar, StageMultiplier } from "./StageMultiplier";
import {
  SCORE_LABELS,
  stageMultiplier,
  type PortfolioCompany,
} from "@/lib/portfolio";

interface Props {
  company: PortfolioCompany;
}

export function PortfolioCard({ company }: Props) {
  const [open, setOpen] = useState(false);
  const m = stageMultiplier(company);

  return (
    <div
      className={`bg-bg-surface border ${
        open ? "border-border-active" : "border-border-subtle"
      } hover:border-border-active transition-colors rounded-sharp`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left p-5 md:p-6 flex flex-col gap-4"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2 flex-wrap">
              <h3 className="font-display text-[26px] leading-none text-text-primary tracking-[-0.01em]">
                {company.company}
              </h3>
              <span className="text-[10px] uppercase tracking-[0.18em] text-text-muted font-sans font-medium">
                {company.category === "legacy" ? "legacy" : "recent"} ·{" "}
                {company.year_invested} · {company.stage_at_investment}
              </span>
            </div>
            <div className="text-[12px] text-text-muted font-sans mt-1">
              {company.round}
            </div>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <TierBadge tier={company.most_likely_outcome} prefix="Predicted" />
              {company.actual_outcome_tier && (
                <TierBadge tier={company.actual_outcome_tier} prefix="Actual" />
              )}
            </div>
          </div>
          <StageMultiplier company={company} size="lg" />
        </div>

        <div className="mt-1">
          <TierDistributionBar
            distribution={company.outcome_distribution}
            highlight={company.most_likely_outcome}
            label="Predicted outcome distribution"
            showLegend={false}
          />
        </div>

        <p className="text-[13px] text-text-secondary leading-[1.55] font-sans">
          {company.verdict}
        </p>

        <div className="-mx-2">
          <PortfolioRadar
            companies={[company]}
            height={200}
            showLegend={false}
            variant="single"
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
          <div className="text-[11px] text-text-muted font-sans">
            {open ? "Tap to collapse" : "Tap for full breakdown"}
          </div>
          <div
            className={`text-[11px] font-mono text-text-muted transition-transform ${
              open ? "rotate-180" : ""
            }`}
          >
            ▾
          </div>
        </div>
      </button>

      {open && (
        <div className="px-5 md:px-6 pb-6 pt-2 space-y-5 border-t border-border-subtle">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-text-muted font-sans font-medium mb-2">
              What it is
            </div>
            <p className="text-[13px] text-text-secondary leading-[1.6] font-sans">
              {company.description}
            </p>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-text-muted font-sans font-medium mb-2">
              Current status
            </div>
            <p className="text-[13px] text-text-secondary leading-[1.6] font-sans">
              {company.current_status}
            </p>
          </div>

          <div className="bg-bg-elevated border border-border-subtle rounded-sharp p-4 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="text-[10px] uppercase tracking-[0.18em] text-text-muted font-sans font-medium">
                Stage context — {company.stage_at_investment}
              </div>
              <div className={`font-data font-semibold tabular-nums text-[14px] ${
                m >= 1.5 ? "text-positive" : m >= 1.1 ? "text-cyan" : m >= 0.9 ? "text-text-secondary" : "text-warning"
              }`}>
                {m.toFixed(1)}× base rate
              </div>
            </div>
            <StageBaseRateBar company={company} />
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-text-muted font-sans font-medium mb-2">
              Predicted vs stage baseline
            </div>
            <div className="space-y-3">
              <TierDistributionBar
                distribution={company.outcome_distribution}
                highlight={company.most_likely_outcome}
                label="Thaler prediction"
                showLegend={false}
              />
              <TierDistributionBar
                distribution={company.stage_context.base_distribution}
                label={`${company.stage_at_investment} base rate`}
                showLegend
              />
            </div>
            <p className="text-[12px] text-text-secondary leading-[1.55] font-sans mt-3 italic">
              {company.stage_context.vs_base}
            </p>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-text-muted font-sans font-medium mb-3">
              Seven-lens scores
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {SCORE_LABELS.map(({ key, label }) => (
                <div
                  key={key}
                  className="bg-bg-elevated border border-border-subtle rounded-sharp px-3 py-2"
                >
                  <div className="text-[10px] uppercase tracking-[0.14em] text-text-muted font-sans">
                    {label}
                  </div>
                  <div className="font-data tabular-nums text-[18px] text-text-primary mt-0.5">
                    {company.scores[key]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-l-2 border-danger/50 pl-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-danger font-sans font-medium mb-1">
                Top risk
              </div>
              <p className="text-[13px] text-text-secondary leading-[1.55] font-sans">
                {company.top_risk}
              </p>
            </div>
            <div className="border-l-2 border-positive/50 pl-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-positive font-sans font-medium mb-1">
                Top opportunity
              </div>
              <p className="text-[13px] text-text-secondary leading-[1.55] font-sans">
                {company.top_opportunity}
              </p>
            </div>
          </div>

          {company.actual_outcome && (
            <div className="bg-bg-elevated border border-border-subtle rounded-sharp p-4">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <div className="text-[10px] uppercase tracking-[0.18em] text-theory font-sans font-medium">
                  What actually happened
                </div>
                {company.actual_outcome_tier && (
                  <TierBadge tier={company.actual_outcome_tier} prefix="Actual" />
                )}
              </div>
              <p className="text-[13px] text-text-secondary leading-[1.6] font-sans italic">
                {company.actual_outcome}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
