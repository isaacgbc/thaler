"use client";

import { useState } from "react";

const LENSES = [
  {
    name: "Macro Economist",
    blurb: "How the country's economy helps or hurts this business.",
    frameworks: "Mundell-Fleming · Taylor Rule · Fisher Effect",
  },
  {
    name: "Demand Signal Analyst",
    blurb: "What real customers say and do, not what surveys claim.",
    frameworks: "Revealed Preference (Samuelson) · Jobs-to-be-Done (Christensen)",
  },
  {
    name: "Moat Quantifier",
    blurb: "How defensible this business is, measured in numbers.",
    frameworks: "7 Powers (Helmer) · VRIO (Barney)",
  },
  {
    name: "Sales & Runway Realist",
    blurb: "True cost of acquiring customers and how long the money lasts.",
    frameworks: "SaaS Metrics (Skok) · LATAM B2B benchmarks",
  },
  {
    name: "Behavioral Pricing Scientist",
    blurb: "Why customers buy or don't, based on cognitive science.",
    frameworks: "Prospect Theory (Kahneman & Tversky) · Nudge (Thaler & Sunstein)",
  },
  {
    name: "AI Disruption Radar",
    blurb: "Which parts of this business AI can replace, and when.",
    frameworks: "Innovator's Dilemma (Christensen) · S-Curve analysis",
  },
  {
    name: "Founder Analysis",
    blurb:
      "Does this founder have the specific problem-fit, execution history, and industry depth this business demands? Not a personality assessment — a pattern match.",
    frameworks:
      "Founder-Problem Fit (40%) · Execution Evidence (35%) · Industry Depth (25%)",
  },
  {
    name: "Monte Carlo Simulator",
    blurb: "1,000 probabilistic futures. What percentage survive?",
    frameworks: "Monte Carlo (Metropolis & Ulam) · Shell scenario planning",
  },
];

const TIERS = [
  { label: "Dead", desc: "Shut down or acqui-hired below 1× capital" },
  { label: "Zombie", desc: "Alive but flat, no growth, founders trapped" },
  { label: "Surviving", desc: "Growing below venture pace (5–15% MoM)" },
  { label: "Thriving", desc: "Venture-scale growth (20%+ MoM), clear path to next round" },
  { label: "Breakout", desc: "Category-defining, fund-returning trajectory" },
];

const STAGES = [
  { stage: "Pre-seed", rate: "8%" },
  { stage: "Seed", rate: "15%" },
  { stage: "Series A", rate: "40%" },
  { stage: "Series B", rate: "55%" },
  { stage: "Series C", rate: "68%" },
];

export function MethodologyExplainer() {
  const [open, setOpen] = useState(false);

  return (
    <section className="px-6 py-16 border-t border-border-subtle">
      <div className="max-w-[720px] mx-auto">
        <div className="consulting-card">
          <button
            onClick={() => setOpen((v) => !v)}
            className="w-full flex items-start justify-between gap-4 p-5 md:p-6 text-left"
          >
            <div>
              <div className="subhead mb-1">Methodology</div>
              <h3 className="font-display text-[26px] md:text-[30px] text-text-primary leading-[1.1] tracking-[-0.01em]">
                How Thaler thinks — frameworks &amp; benchmarks
              </h3>
              <p className="text-[13px] text-text-secondary mt-2 font-sans">
                Eight analytical lenses, five outcome tiers, and the stage
                base rates behind every multiplier.
              </p>
            </div>
            <div
              className={`text-[18px] font-mono text-text-muted transition-transform mt-1 ${
                open ? "rotate-180" : ""
              }`}
              aria-hidden
            >
              ▾
            </div>
          </button>

          {open && (
            <div className="px-5 md:px-6 pb-8 pt-2 space-y-8 border-t border-border-subtle">
              <div>
                <div className="subhead mb-4">The eight lenses</div>
                <ul className="space-y-4">
                  {LENSES.map((l) => (
                    <li key={l.name} className="border-l-2 border-border-subtle pl-4">
                      <div className="font-display text-[17px] text-text-primary leading-[1.3]">
                        {l.name}
                      </div>
                      <div className="text-[13px] text-text-body font-sans leading-[1.55] mt-0.5">
                        {l.blurb}
                      </div>
                      <div className="text-[11px] text-theory font-sans italic mt-1">
                        {l.frameworks}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="subhead mb-4">Outcome tiers</div>
                <ul className="divide-y divide-border-subtle border-t border-b border-border-subtle">
                  {TIERS.map((t) => (
                    <li key={t.label} className="flex items-baseline gap-3 py-2.5">
                      <span className="font-display text-[16px] text-text-primary min-w-[95px]">
                        {t.label}
                      </span>
                      <span className="text-[13px] text-text-body font-sans leading-[1.5]">
                        {t.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="subhead mb-4">Stage base rates</div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {STAGES.map((s) => (
                    <div
                      key={s.stage}
                      className="bg-bg-elevated border border-border-subtle rounded-sharp px-3 py-3 text-center"
                    >
                      <div className="text-[10px] uppercase tracking-[0.14em] text-text-muted font-sans">
                        {s.stage}
                      </div>
                      <div className="font-data tabular-nums text-[20px] text-text-primary mt-1">
                        {s.rate}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-[11px] text-text-muted font-sans italic mt-3">
                  Sources: Horsley Bridge venture return data, CB Insights failure
                  post-mortems (N = 4,000+), Startup Genome Project.
                </div>
              </div>

              <div>
                <div className="subhead mb-3">How to read the multiplier</div>
                <p className="text-[14px] text-text-body font-sans leading-[1.7]">
                  A 38% survival score at pre-seed (base rate 8%) means 4.8× above
                  benchmark — exceptional. A 72% at Series A (base rate 40%) means
                  1.8× — solid but not exceptional. The multiplier tells you how
                  much better than average a company is for its stage. Higher is
                  better; anything under 1× means the company underperforms its
                  stage base rate.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
