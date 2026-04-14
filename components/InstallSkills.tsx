"use client";

import { useState } from "react";

const SKILLS: Array<{
  name: string;
  tagline: string;
  frameworks: string;
}> = [
  {
    name: "thaler-macro-economist",
    tagline: "Country-level macro impact on the business.",
    frameworks: "Mundell-Fleming · Taylor Rule · Fisher Effect",
  },
  {
    name: "thaler-demand-analyst",
    tagline: "Real demand from social and search data, not surveys.",
    frameworks: "Revealed Preference (Samuelson) · JTBD (Christensen)",
  },
  {
    name: "thaler-moat-quantifier",
    tagline: "Competitive defensibility, quantified 0-100.",
    frameworks: "7 Powers (Helmer) · VRIO (Barney)",
  },
  {
    name: "thaler-sales-realist",
    tagline: "Unit economics calibrated to LATAM B2B reality.",
    frameworks: "SaaS Metrics (Skok) · Bridge Group · Bill Gurley",
  },
  {
    name: "thaler-behavioral-pricing",
    tagline: "Cognitive biases in pricing and GTM.",
    frameworks: "Prospect Theory · Nudge · Influence",
  },
  {
    name: "thaler-ai-disruption",
    tagline: "Which parts of the business AI threatens or enables.",
    frameworks: "Innovator's Dilemma (Christensen)",
  },
  {
    name: "thaler-founder-analyst",
    tagline: "Founder-problem fit, execution, industry depth.",
    frameworks: "40/35/25 weighted framework",
  },
  {
    name: "thaler-monte-carlo",
    tagline: "1,000-scenario simulation with outcome tiers.",
    frameworks: "Metropolis & Ulam · Shell scenario planning",
  },
  {
    name: "thaler-full-analysis",
    tagline: "Orchestrator — runs all 8 lenses and synthesizes.",
    frameworks: "All of the above",
  },
];

const INSTALL_COMMAND = `git clone https://github.com/isaacgbc/thaler.git
cp -r thaler/skills/thaler-* ~/.claude/skills/

claude "Use thaler-full-analysis to stress-test: [your business]"`;

export function InstallSkills() {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(INSTALL_COMMAND).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <section
      id="install-skills"
      className="px-6 py-24 bg-bg-void border-t border-border-subtle"
    >
      <div className="max-w-[1100px] mx-auto">
        <div className="max-w-[720px] mb-12">
          <p className="text-[11px] uppercase tracking-[0.2em] text-cyan mb-4 font-sans font-medium">
            The real product
          </p>
          <h2 className="font-display text-[40px] md:text-[52px] text-text-primary leading-[1.05] tracking-[-0.015em] mb-4">
            Install Thaler as Claude Code skills.
          </h2>
          <p className="text-[17px] text-text-secondary leading-[1.6] max-w-[60ch]">
            The web app is the showcase. The product is nine standalone Claude
            Code skills you drop into <span className="font-data text-text-primary">~/.claude/skills/</span>{" "}
            and invoke locally. Each skill is self-contained: system prompt,
            analytical standards, anti-hallucination rules, output schema.
          </p>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-text-secondary font-sans font-medium">
              30-second install
            </p>
            <button
              onClick={copy}
              className="text-[11px] uppercase tracking-[0.2em] text-cyan hover:text-text-primary font-sans font-medium transition-colors"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="bg-bg-surface border border-border-subtle rounded-sharp p-5 md:p-6 overflow-x-auto">
            <code className="font-data text-[13px] md:text-[14px] text-text-primary leading-[1.8] whitespace-pre">
{INSTALL_COMMAND}
            </code>
          </pre>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-text-secondary mb-5 font-sans font-medium">
            The nine skills
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SKILLS.map((s) => (
              <div
                key={s.name}
                className="border border-border-subtle hover:border-border-active transition-colors bg-bg-surface rounded-sharp p-5"
              >
                <p className="font-data text-[13px] text-cyan mb-2">
                  {s.name}
                </p>
                <p className="text-[14px] text-text-primary leading-[1.5] mb-3">
                  {s.tagline}
                </p>
                <p className="font-display italic text-[12px] text-theory">
                  {s.frameworks}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-text-secondary font-sans">
          <a
            href="https://github.com/isaacgbc/thaler"
            target="_blank"
            rel="noreferrer"
            className="text-cyan hover:text-text-primary transition-colors"
          >
            github.com/isaacgbc/thaler →
          </a>
          <span className="text-text-muted">MIT license · stateless · no account required</span>
        </div>
      </div>
    </section>
  );
}
