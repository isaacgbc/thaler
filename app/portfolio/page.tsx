"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  PORTFOLIO,
  stageMultiplier,
  type PortfolioCategory,
} from "@/lib/portfolio";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { PortfolioRadar } from "@/components/portfolio/PortfolioRadar";
import { PortfolioBarChart } from "@/components/portfolio/PortfolioBarChart";
import { Footer } from "@/components/Footer";
import { LanV4Section } from "@/components/lan/LanV4Section";

type Filter = "all" | PortfolioCategory;

const FILTERS: Array<{ id: Filter; label: string; hint: string }> = [
  { id: "all", label: "All", hint: "11 companies" },
  { id: "legacy", label: "Legacy", hint: "2013 – 2019" },
  { id: "recent", label: "Recent", hint: "2025 – 2026" },
];

export default function PortfolioPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [showAllRadar, setShowAllRadar] = useState(false);

  const filtered = useMemo(
    () =>
      filter === "all" ? PORTFOLIO : PORTFOLIO.filter((c) => c.category === filter),
    [filter]
  );

  const legacy = useMemo(
    () => PORTFOLIO.filter((c) => c.category === "legacy"),
    []
  );
  const recent = useMemo(
    () => PORTFOLIO.filter((c) => c.category === "recent"),
    []
  );

  const radarCompanies = filter === "all" ? PORTFOLIO : filtered;

  const visibleRadarCompanies = useMemo(() => {
    if (showAllRadar) return radarCompanies;
    if (radarCompanies.length <= 6) return radarCompanies;
    const sorted = [...radarCompanies].sort(
      (a, b) => stageMultiplier(b) - stageMultiplier(a)
    );
    const top = sorted.slice(0, 3);
    const bottom = sorted.slice(-3);
    return [...top, ...bottom];
  }, [radarCompanies, showAllRadar]);

  const { hits, nearMisses, misses } = useMemo(() => {
    let hits = 0;
    let nearMisses = 0;
    let misses = 0;
    const order = ["dead", "zombie", "surviving", "thriving", "breakout"];
    for (const c of legacy) {
      if (!c.actual_outcome_tier) continue;
      const predIdx = order.indexOf(c.most_likely_outcome);
      const actIdx = order.indexOf(c.actual_outcome_tier);
      const delta = Math.abs(predIdx - actIdx);
      if (delta === 0) hits++;
      else if (delta === 1) nearMisses++;
      else misses++;
    }
    return { hits, nearMisses, misses };
  }, [legacy]);

  return (
    <main className="relative bg-bg-void min-h-screen">
      <nav className="px-6 pt-8 pb-4 border-b border-border-subtle">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="font-display text-[20px] text-text-primary hover:text-cyan transition-colors"
          >
            Thaler
          </Link>
          <Link
            href="/"
            className="text-[12px] font-sans text-text-secondary hover:text-text-primary transition-colors"
          >
            ← Back to analysis
          </Link>
        </div>
      </nav>

      <header className="px-6 pt-16 pb-10">
        <div className="max-w-[720px] mx-auto">
          <div className="text-[11px] uppercase tracking-[0.2em] text-theory font-sans font-medium mb-4">
            Portfolio monitoring mode
          </div>
          <h1 className="font-display text-[44px] md:text-[60px] text-text-primary leading-[1.03] tracking-[-0.015em] mb-5">
            Thaler works for any business.
          </h1>
          <p className="text-[17px] text-text-body leading-[1.7] max-w-[60ch] mb-4">
            To show you what it can do, we ran it on something you know well:
            Kaszek&rsquo;s last eleven investments.
          </p>
          <p className="text-[15px] text-text-secondary leading-[1.6] max-w-[60ch]">
            Each company re-evaluated against current macro conditions,
            competitive landscape, AI disruption risk, and founder-problem fit.
            For the five legacy bets we score them as they looked at investment,
            then show what actually happened. For the six recent ones, the
            outcome is still unwritten.
          </p>
          <p className="text-[11px] text-text-muted font-sans mt-5 tracking-[0.05em]">
            Last updated April 14, 2026.
          </p>
          <div className="mt-8 p-4 bg-bg-surface border border-theory/30 rounded-sharp">
            <div className="flex items-start gap-3 flex-wrap">
              <div className="text-[10px] uppercase tracking-[0.18em] text-theory font-sans font-medium mt-0.5 shrink-0">
                Reading guide
              </div>
              <p className="text-[13px] text-text-secondary leading-[1.55] font-sans flex-1 min-w-[280px]">
                Absolute scores reflect survival probability — earlier-stage
                companies naturally score lower because the base rate is lower. A
                38% at pre-seed ({legacy.length > 0 ? "Nubank" : "pre-seed"}) is
                exceptional; an 80% at Series C is expected. Use the <span className="text-theory font-medium">multiplier vs stage benchmark</span> and the <span className="text-theory font-medium">predicted outcome-tier distribution</span> as the real signal. Tier framework inspired by Horsley Bridge, Correlation Ventures, and Startup Genome lifecycle data.
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="px-6 pb-6">
        <div className="max-w-[1100px] mx-auto flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => {
            const active = f.id === filter;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-sharp border text-[12px] font-sans font-medium tracking-[0.05em] transition-colors ${
                  active
                    ? "bg-cyan text-text-inverse border-cyan"
                    : "bg-bg-surface text-text-secondary border-border-subtle hover:border-border-active"
                }`}
              >
                <span className="uppercase">{f.label}</span>
                <span className="ml-2 text-[10px] opacity-70 normal-case">
                  {f.hint}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="consulting-card p-5 md:p-6">
            <div className="flex items-start justify-between flex-wrap gap-2 mb-1">
              <div className="subhead">Seven-lens radar overlay</div>
              <button
                onClick={() => setShowAllRadar((v) => !v)}
                className="text-[11px] font-sans font-medium text-cyan hover:underline tracking-[0.04em]"
              >
                {showAllRadar ? "Show top 3 + bottom 3" : "Show all 11"}
              </button>
            </div>
            <h2 className="font-display text-[22px] text-text-primary leading-tight mb-1">
              {showAllRadar
                ? "All eleven companies, one chart"
                : "Top 3 and bottom 3 by stage multiplier"}
            </h2>
            <p className="text-[12px] text-text-muted font-sans leading-[1.5] mb-4">
              {showAllRadar
                ? "Dense overlay — use filters above for a cleaner read."
                : "Cleaner comparison: best and worst performers vs their stage benchmark."}
            </p>
            <PortfolioRadar companies={visibleRadarCompanies} height={380} />
          </div>

          <div className="consulting-card p-5 md:p-6">
            <div className="subhead mb-1">
              Ranked by Thaler score · black ticks are stage base rates
            </div>
            <h2 className="font-display text-[22px] text-text-primary leading-tight mb-4">
              Who beats the odds for their stage
            </h2>
            <PortfolioBarChart companies={filtered} height={380} />
            <div className="flex flex-wrap items-center gap-4 mt-3 text-[11px] font-sans text-text-muted">
              <span className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-[#B8B5AD] rounded-sharp" />
                Legacy
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 bg-cyan rounded-sharp" />
                Recent
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block w-[2px] h-3 bg-text-primary" />
                Stage base rate
              </span>
            </div>
          </div>
        </div>
      </section>

      {legacy.length > 0 && (
        <section className="px-6 py-6">
          <div className="max-w-[1100px] mx-auto">
            <div className="bg-bg-surface border border-border-subtle rounded-sharp p-6">
              <div className="flex items-start justify-between gap-6 flex-wrap">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-text-muted font-sans font-medium mb-1">
                    Hit rate on legacy
                  </div>
                  <h3 className="font-display text-[28px] text-text-primary leading-tight mb-2">
                    Thaler&rsquo;s predicted tier vs what actually happened
                  </h3>
                  <p className="text-[13px] text-text-secondary leading-[1.55] font-sans max-w-[56ch]">
                    Scoring {legacy.length} legacy bets against their realized
                    tier. Exact-tier hit counts; adjacent-tier is within one
                    step; miss is two+ steps off. The Nubank pre-seed call is an
                    instructive miss: Thaler predicted &ldquo;surviving&rdquo;
                    (the base-rate gravity); the outcome was breakout. Capex
                    risk on Kavak was also under-weighted.
                  </p>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <StatTile label="Exact hits" value={hits} total={legacy.length} tone="cyan" />
                  <StatTile label="±1 tier" value={nearMisses} total={legacy.length} tone="neutral" />
                  <StatTile label="Missed by 2+" value={misses} total={legacy.length} tone="warn" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="px-6 py-10 border-t border-border-subtle">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-text-muted font-sans font-medium mb-1">
                {filter === "all"
                  ? `${PORTFOLIO.length} companies`
                  : `${filtered.length} ${filter} companies`}
              </div>
              <h2 className="font-display text-[32px] md:text-[38px] text-text-primary leading-[1.05] tracking-[-0.01em]">
                The grid.
              </h2>
            </div>
            {filter === "all" && (
              <div className="text-[12px] font-sans text-text-muted max-w-[44ch]">
                Legacy avg multiplier: {avgMultiplier(legacy)}× base rate. Recent
                avg: {avgMultiplier(recent)}× base rate. Tap any card for the
                full breakdown.
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((c) => (
              <PortfolioCard key={c.company} company={c} />
            ))}
          </div>
        </div>
      </section>

      <LanV4Section />

      <Footer />
    </main>
  );
}

function avgMultiplier(list: typeof PORTFOLIO) {
  if (!list.length) return "—";
  const m = list.reduce((acc, c) => acc + stageMultiplier(c), 0) / list.length;
  return m.toFixed(1);
}

function StatTile({
  label,
  value,
  total,
  tone,
}: {
  label: string;
  value: number;
  total: number;
  tone: "cyan" | "neutral" | "warn";
}) {
  const toneClass =
    tone === "cyan"
      ? "text-cyan"
      : tone === "warn"
      ? "text-warning"
      : "text-text-secondary";
  return (
    <div className="bg-bg-elevated border border-border-subtle rounded-sharp px-4 py-3 min-w-[110px]">
      <div className="text-[10px] uppercase tracking-[0.14em] text-text-muted font-sans font-medium">
        {label}
      </div>
      <div className={`font-data tabular-nums text-[28px] leading-none mt-1 ${toneClass}`}>
        {value}
        <span className="text-[14px] text-text-muted">/{total}</span>
      </div>
    </div>
  );
}
