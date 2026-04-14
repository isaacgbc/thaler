---
name: thaler-full-analysis
description: Run all 8 Thaler economic lenses on a business and synthesize them into a unified stress-test report with Monte Carlo survival probability, outcome-tier distribution, top risks and opportunities, and prioritized recommendations. Use when the user asks for a full business stress-test, survival analysis, investment evaluation, or startup reality-check.
---

# Thaler Full Analysis

## What this skill does
Runs eight specialized economic analyses on any business (not just tech startups) and produces a complete stress-test report. The Monte Carlo simulator synthesizes the upstream lenses into one headline survival score, an outcome-tier distribution (dead/zombie/surviving/thriving/breakout), and a ranked list of fragile assumptions.

## When to use
- Evaluating a startup or established business before investing or committing resources
- Stress-testing your own business before a fundraise, pivot, or major hire
- Validating whether a "$50B market" claim translates into real survival odds
- Producing an investment-committee-grade memo from a single business description

## How to use

```
Use the thaler-full-analysis skill to stress-test: [describe the business
with as much detail as possible — revenue, team, country, market, business
model, stage, funding, known metrics like churn and CAC]
```

## Execution plan (run in this order)

The lenses run in two waves. Lenses 1-7 are independent and can run in parallel. Lens 8 (Monte Carlo) depends on the outputs of 1-7.

**Wave A — run in parallel:**
1. `thaler-macro-economist` — country-level macro impact
2. `thaler-demand-analyst` — real demand from social/search data
3. `thaler-moat-quantifier` — competitive defensibility, scored 0-100
4. `thaler-sales-realist` — unit economics, LATAM benchmarks, runway in sales cycles
5. `thaler-behavioral-pricing` — cognitive biases in pricing and GTM
6. `thaler-ai-disruption` — AI threats and opportunities, defensible core
7. `thaler-founder-analyst` — founder-problem fit, execution, industry depth

**Wave B — run after Wave A completes:**
8. `thaler-monte-carlo` — 1,000-scenario simulation synthesizing all upstream JSON

## Unified report format

After running all 8 lenses, produce a single synthesized report:

```json
{
  "business": "string — one-line summary of what was analyzed",
  "headline": {
    "survival_probability_pct": 0-100,
    "most_likely_outcome": "dead | zombie | surviving | thriving | breakout",
    "stage": "Pre-seed | Seed | Series A | Series B | Series C",
    "outcome_distribution": {"dead": int, "zombie": int, "surviving": int, "thriving": int, "breakout": int},
    "vs_stage_base": "string — deltas vs base-rate with lens-based justification"
  },
  "verdict": "string — single falsifiable sentence with IF/THEN structure",
  "top_risks": ["string", "string", "string"],
  "top_opportunities": ["string", "string", "string"],
  "actions": ["string — specific, prioritized, 30/60/90-day", "string", "string"],
  "fragile_assumptions": ["string — what, if false, would move survival below 50%"],
  "lenses": {
    "macro": {...},
    "demand": {...},
    "moat": {...},
    "sales": {...},
    "behavioral": {...},
    "ai_disruption": {...},
    "founder": {...},
    "monte_carlo": {...}
  }
}
```

## Quality rules (apply across all lenses)

1. ARGUE, DON'T DESCRIBE. Framework + sourced data + implication for THIS business.
2. STEEL-MAN THE COUNTER-ARGUMENT. Every positive finding includes its own rebuttal.
3. QUANTIFY OR QUALIFY. No "significant", "strong", "growing" without a number, unit, source.
4. CITE THEORY ONLY WHEN IT CHANGES THE CONCLUSION. No decorative citations.
5. DISAGREE. Flag contradictions between lenses. If everything agrees, something is wrong.
6. SOURCES OR SILENCE. Never fabricate data, competitors, or quotes.
7. THE VERDICT MUST BE FALSIFIABLE. State as testable hypothesis with IF/THEN conditions.

## Installation

Copy all Thaler skills to your Claude Code skills directory:

```bash
git clone https://github.com/isaacgbc/thaler.git
cp -r thaler/skills/thaler-* ~/.claude/skills/
```

Or install just this orchestrator plus the 8 lenses it calls:

```bash
cp -r thaler/skills/thaler-full-analysis ~/.claude/skills/
cp -r thaler/skills/thaler-macro-economist ~/.claude/skills/
cp -r thaler/skills/thaler-demand-analyst ~/.claude/skills/
cp -r thaler/skills/thaler-moat-quantifier ~/.claude/skills/
cp -r thaler/skills/thaler-sales-realist ~/.claude/skills/
cp -r thaler/skills/thaler-behavioral-pricing ~/.claude/skills/
cp -r thaler/skills/thaler-ai-disruption ~/.claude/skills/
cp -r thaler/skills/thaler-founder-analyst ~/.claude/skills/
cp -r thaler/skills/thaler-monte-carlo ~/.claude/skills/
```

## Part of
[Thaler](https://github.com/isaacgbc/thaler) — 8-lens AI business stress-tester. Theory. Street. Data. Built with Claude at the Build with Claude hackathon, Buenos Aires, April 14, 2026.
