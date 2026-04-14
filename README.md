# Thaler

**8 AI economists that stress-test any business. Theory. Street. Data.**

Built in 6 hours at the [Build with Claude](https://buildwithclaude.com) hackathon, Buenos Aires, April 14, 2026.

Named after Richard Thaler, Nobel laureate (2017) in behavioral economics, who proved that Homo Economicus is fiction. Real economic agents are irrational, biased, and predictably so. You can't build systems for humans without understanding how humans actually decide. That's what Thaler does for businesses.

- **Live demo** → https://thaler-kappa.vercel.app
- **Kaszek portfolio validation** → https://thaler-kappa.vercel.app/portfolio

## What is Thaler?

Thaler runs 8 specialized economic analyses on any business — not just tech startups — and produces a stress-test report with a survival probability, an outcome-tier distribution (dead / zombie / surviving / thriving / breakout), and a ranked list of fragile assumptions.

In the post-AI era, anyone can build an app in a weekend. What hasn't been commoditized — and can't be — is **domain knowledge**. Price elasticity. Loss aversion. The 3-7 approval chain in an Argentine corporate. The 2.25x loss-aversion coefficient from Kahneman & Tversky. The real CAC in markets where Meta Ads cost in USD but revenue is in pesos.

AI slop produces apps. Thaler stress-tests whether those apps — or any business — can survive contact with reality.

## The 8 lenses

| # | Lens | What it does | Frameworks |
|---|------|-------------|------------|
| 1 | Macro Economist | Country-level macro impact on the business | Mundell-Fleming, Taylor Rule, Fisher Effect |
| 2 | Demand Signal Analyst | Real demand from social/search data, not surveys | Revealed Preference (Samuelson, 1938), JTBD (Christensen, 2003) |
| 3 | Moat Quantifier | Competitive defensibility, quantified 0-100 | 7 Powers (Helmer, 2016), VRIO (Barney, 1991) |
| 4 | Sales & Runway Realist | Unit economics with LATAM B2B benchmarks | SaaS Metrics (Skok), Bridge Group, Bill Gurley |
| 5 | Behavioral Pricing | Cognitive biases in pricing and GTM | Prospect Theory (K&T, 1979), Nudge (Thaler, 2008), Influence (Cialdini, 1984) |
| 6 | AI Disruption Radar | Which parts of the business AI threatens or enables | Innovator's Dilemma (Christensen, 1997) |
| 7 | Founder Analyst | Founder-problem fit, execution, industry depth | 40/35/25 weighting |
| 8 | Monte Carlo Simulator | 1,000 scenarios, outcome tiers, sensitivity analysis | Metropolis & Ulam (1949), Shell scenario planning |

## Use as Claude Code Skills

The real product is the `skills/` directory — 9 standalone Claude Code skills anyone can drop into `~/.claude/skills/` and invoke locally.

```bash
# Clone the repo
git clone https://github.com/isaacgbc/thaler.git

# Install all 9 skills (8 lenses + orchestrator)
cp -r thaler/skills/thaler-* ~/.claude/skills/

# Run a full analysis in Claude Code
claude "Use thaler-full-analysis to stress-test: [your business description]"
```

You can also invoke any individual lens on its own:

```bash
claude "Use thaler-macro-economist to analyze: [business + country]"
claude "Use thaler-moat-quantifier to analyze: [business]"
claude "Use thaler-monte-carlo to simulate: [business + metrics]"
```

Each skill is self-contained — full system prompt, analytical standards, anti-hallucination rules, output schema, and framework citations in a single `SKILL.md`.

## Architecture

```
User Input
  "Industrial laundry chain in Buenos Aires, B2B hotels, $40K/mo"
        │
        ▼
  ┌─────────────────────────────────────────────────────┐
  │              THALER ORCHESTRATOR                    │
  │   (Next.js API route, parallel dispatch of 7)       │
  └──┬──────┬──────┬──────┬──────┬──────┬──────┬───────┘
     │      │      │      │      │      │      │
     ▼      ▼      ▼      ▼      ▼      ▼      ▼
   Macro  Demand  Moat  Sales  Behav  AI     Founder
                                       Radar
                        │
                        ▼ (Wave B, receives upstream JSON)
                  ┌──────────────┐
                  │  Monte Carlo │
                  └──────┬───────┘
                         │
                         ▼
            ┌──────────────────────────────┐
            │   UNIFIED STRESS REPORT      │
            │  Survival % + outcome tiers  │
            └──────────────────────────────┘
```

Each lens is a Claude Haiku 4.5 agent with an Opus 4.6 advisor tool (`advisor-tool-2026-03-01` beta) plus `web_search`. Haiku handles searching, formatting, and JSON output. When it hits a complex reasoning decision — quantifying a moat, interpreting contradictory macro signals — it escalates to Opus server-side. One API call, shared context, no orchestration overhead.

A full 8-lens analysis costs ~$0.15–0.30 in inference.

## Validated against reality

Tested on 5 legacy Kaszek investments (2013–2019) where outcomes are already known:

- 2 exact tier predictions
- 2 within one tier
- 1 miss (Nubank at pre-seed — predicted surviving, actual breakout)

The portfolio validation dashboard is live at https://thaler-kappa.vercel.app/portfolio.

## Tech stack

- **Framework**: Next.js 14 (App Router) + TypeScript + Tailwind
- **AI**: Anthropic SDK, Claude Haiku 4.5 (executor) + Claude Opus 4.6 (advisor) via `advisor-tool-2026-03-01` beta
- **Charts**: Recharts
- **Deploy**: Vercel
- **Database**: None. Stateless. Every analysis runs fresh.

## Repository layout

```
thaler/
├── app/                  # Next.js App Router pages and API routes
├── components/           # React components (sections, charts, UI)
├── lib/
│   ├── agents/           # 8 lens agents + orchestrator
│   ├── anthropic.ts      # Shared client, analytical standards, anti-hallucination rules
│   └── types.ts          # TypeScript types for every lens output
├── skills/               # 9 Claude Code skills (THE PRODUCT)
│   ├── thaler-macro-economist/SKILL.md
│   ├── thaler-demand-analyst/SKILL.md
│   ├── thaler-moat-quantifier/SKILL.md
│   ├── thaler-sales-realist/SKILL.md
│   ├── thaler-behavioral-pricing/SKILL.md
│   ├── thaler-ai-disruption/SKILL.md
│   ├── thaler-founder-analyst/SKILL.md
│   ├── thaler-monte-carlo/SKILL.md
│   └── thaler-full-analysis/SKILL.md
├── fixtures/             # Cached demo analyses
├── CLAUDE.md             # Full product brief and design system
└── README.md             # You are here
```

## Local development

```bash
git clone https://github.com/isaacgbc/thaler.git
cd thaler
pnpm install
cp .env.local.example .env.local  # add your ANTHROPIC_API_KEY
pnpm dev
```

## Built by

Isaac Gutiérrez Brugada — Economist, Managing Partner at LAN Accelerator (backed by IDB Lab), President of PARCAPY (Paraguay VC Association).

## License

MIT
