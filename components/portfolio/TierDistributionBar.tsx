"use client";

import {
  TIER_META,
  TIER_ORDER,
  type OutcomeDistribution,
  type OutcomeTier,
} from "@/lib/portfolio";

interface Props {
  distribution: OutcomeDistribution;
  label?: string;
  highlight?: OutcomeTier | null;
  compact?: boolean;
  showLegend?: boolean;
}

const HEIGHT_FULL = "h-6";
const HEIGHT_COMPACT = "h-3";

export function TierDistributionBar({
  distribution,
  label,
  highlight,
  compact = false,
  showLegend = true,
}: Props) {
  const total = TIER_ORDER.reduce((acc, t) => acc + (distribution[t] ?? 0), 0);
  const safeTotal = total > 0 ? total : 1;

  return (
    <div className="w-full">
      {label && (
        <div className="text-[10px] uppercase tracking-[0.14em] text-text-muted font-sans font-medium mb-1.5">
          {label}
        </div>
      )}
      <div
        className={`flex w-full overflow-hidden rounded-sharp border border-border-subtle ${
          compact ? HEIGHT_COMPACT : HEIGHT_FULL
        }`}
      >
        {TIER_ORDER.map((tier) => {
          const pct = distribution[tier] ?? 0;
          if (pct <= 0) return null;
          const width = (pct / safeTotal) * 100;
          const meta = TIER_META[tier];
          const isHighlight = highlight === tier;
          const dimmed = highlight && !isHighlight;
          return (
            <div
              key={tier}
              className="relative transition-opacity"
              style={{
                width: `${width}%`,
                backgroundColor: meta.colors.segment,
                opacity: dimmed ? 0.55 : 1,
              }}
              title={`${meta.label}: ${pct}%`}
            >
              {!compact && width >= 10 && (
                <span
                  className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-semibold"
                  style={{ color: meta.colors.onSegment }}
                >
                  {pct}%
                </span>
              )}
            </div>
          );
        })}
      </div>
      {showLegend && !compact && (
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
          {TIER_ORDER.map((tier) => {
            const meta = TIER_META[tier];
            const pct = distribution[tier] ?? 0;
            const isHighlight = highlight === tier;
            return (
              <div
                key={tier}
                className="flex items-center gap-1 text-[10px] font-sans"
                style={{
                  color: isHighlight ? meta.colors.badgeText : "var(--text-muted)",
                  fontWeight: isHighlight ? 600 : 400,
                }}
              >
                <span
                  className="inline-block w-2 h-2 rounded-sharp"
                  style={{ backgroundColor: meta.colors.segment }}
                />
                <span>
                  {meta.icon} {meta.label} {pct}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function TierBadge({ tier, prefix }: { tier: OutcomeTier; prefix?: string }) {
  const meta = TIER_META[tier];
  const c = meta.colors;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sharp border text-[11px] font-sans font-medium tracking-[0.04em]"
      style={{
        backgroundColor: c.badgeBg,
        color: c.badgeText,
        borderColor: c.badgeBorder,
      }}
    >
      <span className="font-mono leading-none">{meta.icon}</span>
      {prefix && (
        <span
          className="uppercase tracking-[0.14em] text-[9px]"
          style={{ color: c.badgeText, opacity: 0.65 }}
        >
          {prefix}
        </span>
      )}
      <span>{meta.label}</span>
    </span>
  );
}
