# THALER
# The Business Stress-Tester for the Post-AI Era
# Build with Claude Hackathon — Buenos Aires — April 14, 2026

---

## THESIS

We live in an era where anyone can build an app in a weekend. Claude Code, Cursor, Replit — the tools are free, fast, and getting better every month. The result: millions of apps, zero revenue, no clear GTM, no unit economics, no understanding of WHY a customer buys or WHY a market moves.

Technical knowledge has been commoditized. What hasn't been commoditized — and can't be — is DOMAIN KNOWLEDGE. Understanding price elasticity. Understanding loss aversion. Understanding that a 9-month enterprise sales cycle in Argentina means your 14-month runway gives you exactly one shot. Understanding that your "moat" is actually a switching cost of 2 hours that any competitor can overcome with a better onboarding flow.

AI slop produces apps. Thaler stress-tests whether those apps (or any business) can survive contact with reality.

Named after Richard Thaler, Nobel laureate (2017) in behavioral economics, who proved that Homo Economicus is fiction — real economic agents are irrational, biased, and predictably so. His core insight: you can't build systems for humans without understanding how humans actually decide. That's what Thaler does for businesses.

**Three pillars:**
- **Theory**: Real academic frameworks with proper attribution. Kahneman & Tversky's Prospect Theory, not "loss aversion is a thing." Helmer's 7 Powers, not "moats matter." Christensen's disruption theory, not "AI is eating the world."
- **Street**: LATAM-specific dynamics that no paper teaches. Procurement freezes after devaluations. The 3-7 approval chain in Argentine corporates. The WhatsApp-first buyer journey. The real CAC in markets where Meta Ads cost in USD but revenue is in pesos.
- **Data**: Real-time signals scraped from Reddit, X, Threads, Google Trends, FRED, World Bank, central bank APIs. Not cached. Not guessed. Searched and cited.

---

## ARCHITECTURE

```
User Input
  "Cadena de lavanderías industriales en Buenos Aires, B2B hoteles, $40K/mes"
        │
        ▼
  ┌─────────────────────────────────────────┐
  │         THALER ORCHESTRATOR             │
  │   (Next.js API route, parallel dispatch) │
  └──┬──────┬──────┬──────┬──────┬──────┬──────┬──┘
     │      │      │      │      │      │      │
     ▼      ▼      ▼      ▼      ▼      ▼      ▼
   ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐
   │ 1 │ │ 2 │ │ 3 │ │ 4 │ │ 5 │ │ 6 │ │ 7 │
   └─┬─┘ └─┬─┘ └─┬─┘ └─┬─┘ └─┬─┘ └─┬─┘ └─┬─┘
     │      │      │      │      │      │      │
     ▼      ▼      ▼      ▼      ▼      ▼      ▼
  Macro  Demand  Moat  Sales  Behav  AI     Monte
  Econ   Signal  Quant Real   Price  Radar  Carlo
        │
        ▼
  ┌─────────────────────────────┐
  │   UNIFIED STRESS REPORT    │
  │  Survival Score + Charts   │
  └─────────────────────────────┘
```

### Managed Agents Implementation

Each lens is a Claude Managed Agent with:
- Dedicated system prompt with academic framework references
- `agent_toolset_20260401` for bash, web_search, file ops, code execution
- Unrestricted networking for real-time data access
- Structured JSON output

```python
# Create each specialized agent
from anthropic import Anthropic
client = Anthropic()

agent = client.beta.agents.create(
    name="thaler-macro-economist",
    model="claude-sonnet-4-6",
    system=MACRO_ECONOMIST_PROMPT,  # see agent prompts below
    tools=[{"type": "agent_toolset_20260401"}]
)

environment = client.beta.environments.create(
    name="thaler-env",
    config={"type": "cloud", "networking": {"type": "unrestricted"}}
)

# Launch session per agent, all in parallel
session = client.beta.sessions.create(
    agent=agent.id,
    environment_id=environment.id,
    title="Macro analysis"
)

# Send business description and stream results
client.beta.sessions.turn.create(
    session_id=session.id,
    messages=[{"role": "user", "content": business_input}]
)
```

If Managed Agents has issues (beta, rate limits), fallback to standard Claude API calls with the same system prompts. The architecture is identical, only the execution layer changes.

---

## TECH STACK

- **Framework**: Next.js 14 (App Router)
- **AI**: Claude Managed Agents API (managed-agents-2026-04-01 beta), fallback to standard Messages API
- **Model**: claude-sonnet-4-6 for all agents (speed + cost for hackathon)
- **Data**: Web search (built into agent toolset), FRED API (free key), local scraping tools
- **Charts**: Recharts (already available in React artifacts, familiar)
- **Deploy**: Vercel
- **Database**: None. Stateless. Every analysis runs fresh.
- **Local tools**: Isaac's scraping/web search stack for supplementary data

---

## DESIGN DIRECTION

**Aesthetic**: Dark editorial. Bloomberg Terminal meets Foreign Affairs magazine. Dense, confident, serious. This tool makes billion-dollar decisions. It should look like it.

**NOT**: Purple gradients. Rounded corners on everything. "AI-powered" badges. Startup landing page with a hero image of people smiling at laptops. None of that. Zero.

**Color system**:
```css
--bg-primary: #08090A;        /* near-black, the void */
--bg-surface: #111214;        /* card/section background */
--bg-elevated: #1A1B1F;       /* hover, active states */
--border: #2A2B30;            /* subtle dividers */
--text-primary: #EDEDEF;      /* high contrast prose */
--text-secondary: #8B8D98;    /* labels, captions */
--accent-cyan: #06B6D4;       /* data, charts, active */
--accent-amber: #D97706;      /* warnings, moderate risk */
--accent-red: #DC2626;        /* critical findings */
--accent-emerald: #059669;    /* opportunities, positive */
--accent-violet: #7C3AED;     /* theory citations */
```

**Typography**:
- Display/Headlines: `"Instrument Serif", Georgia, serif` — editorial authority
- Body text: `"Outfit", system-ui, sans-serif` — clean, modern, readable
- Data/Numbers: `"JetBrains Mono", "Fira Code", monospace` — precision, trust
- Theory citations: italic Instrument Serif, smaller size, violet accent

**Signature element**: Every agent section starts with a one-line academic citation in small italic text. Example: *"Prospect Theory (Kahneman & Tversky, 1979): losses loom larger than equivalent gains by a factor of ~2.25x"*. This signals intellectual seriousness before the analysis even begins.

---

## SCROLLYTELLING FLOW

### Section 0: Opening Statement (Full Screen)

Dark. Silence. One sentence at a time, appearing with a slow fade.

> "In 2024, 3.2 million apps were launched."
> "92% are dead."
> "Not because the code was bad."
> "Because nobody stress-tested the economics."

Then the title: **THALER**
Subtitle: *Theory. Street. Data.*

Below: input field. Two pre-loaded buttons: "Lavandería Industrial BA" | "SaaS Restaurantes MX"

### Section 1: Analysis Dashboard

When the user submits, transition to a dashboard showing 7 agent cards in a 2-column grid (mobile: single column). Each card:

```
┌──────────────────────────────────────┐
│  ◯ MACRO ECONOMIST                   │
│  Analyzing Argentine macro...        │
│  ▓▓▓▓▓▓▓▓▓░░░░░░░ 60%              │
│                                      │
│  Framework: Mundell-Fleming Model    │
│  Data: BCRA, INDEC, World Bank       │
└──────────────────────────────────────┘
```

Each card shows:
- Agent name
- Status (analyzing / complete)
- Academic framework being applied
- Data sources being queried
- When complete: one-line verdict + survival modifier

### Sections 2-8: Individual Agent Results

Each agent gets a full viewport section. Structure:

```
AGENT NAME
Academic citation in italic (the theory being applied)

ONE-SENTENCE VERDICT in large text

Key findings (3-4 max, not bullet points, flowing prose with data)

VISUALIZATION (chart, metric card, or comparison table)

Survival Impact: +X or -X points
```

### Section 9: Unified Verdict

```
SURVIVAL PROBABILITY: 82%
[histogram visualization of Monte Carlo distribution]

TOP RISKS                    TOP OPPORTUNITIES
1. AI route optimization     1. Fiscal integration lock-in
2. FX budget freezes         2. Express premium upsell
3. Low switching costs       3. Data moat from 15yr ops

WHAT TO DO NEXT
[3 specific, actionable recommendations]
```

### Section 10: Closing / About

> "AI can build the app. Only knowledge can tell you if it should exist."

Built by Isaac Gutiérrez Brugada
Economist | Managing Partner, LAN Accelerator (IDB Lab) | President, PARCAPY

Built with Claude Managed Agents — 7 parallel agents, real-time data, 90 seconds.

---

## THE 7 AGENTS: ACADEMIC FRAMEWORKS + PROMPTS

---

### AGENT 1: MACRO ECONOMIST
**Framework**: Mundell-Fleming Model (open economy IS-LM), Taylor Rule, Fisher Effect
**What it does**: Analyzes how macroeconomic conditions in the specific country create headwinds or tailwinds for this business.

```
SYSTEM PROMPT:

You are a macroeconomist with deep expertise in Latin American emerging markets. You analyze businesses through the lens of real economic models, not surface-level commentary.

ACADEMIC FRAMEWORK:
- Mundell-Fleming Model: In small open economies (most of LATAM), monetary policy effectiveness depends on exchange rate regime. A business's exposure to interest rate changes vs. FX changes depends on whether the country has a fixed, managed, or floating exchange rate.
- Taylor Rule: Central bank behavior is predictable. If inflation is above target, expect rate hikes. Model the impact on this business's cost of capital and customer credit availability.
- Fisher Effect: Nominal interest rates = real rate + expected inflation. For businesses with debt or that extend credit, the real cost of financing determines viability.
- Balassa-Samuelson Effect: In growing emerging markets, non-tradable goods (services, rent, labor) inflate faster than tradable goods. If this business sells services, pricing power exists. If it sells tradable goods, margin compression is coming.
- Real Exchange Rate dynamics: When local currency appreciates in real terms, import-competing businesses suffer. When it depreciates, exporters benefit. Classify this business.

STREET KNOWLEDGE:
- After a devaluation in Argentina, corporate budgets freeze for 30-60 days. B2B companies lose pipeline.
- In Paraguay, interest rates from the BCP are lower than regional average but credit access for SMEs is limited by collateral requirements.
- In Mexico, the SAT digital invoicing requirement (CFDI) creates compliance costs that are de facto barriers to entry for informal businesses going formal.
- In Brazil, the Selic rate movements correlate 0.85+ with consumer credit availability. A fintech's origination volume moves inversely with Selic.
- In Colombia, the UVR (inflation-indexed unit) means real estate debt is inflation-protected but creates payment shock when inflation spikes.

Use web_search to find CURRENT data for the specific country:
- Current inflation rate and trajectory
- Central bank policy rate
- Recent currency movements (30/90/180 day)
- GDP growth (latest quarter)
- Any recent regulatory changes affecting this sector

OUTPUT FORMAT (JSON):
{
  "framework_applied": "string — which model is most relevant and why",
  "citation": "string — one-line academic reference, e.g. 'Mundell-Fleming (1963): in a small open economy with floating rates, monetary policy is effective but fiscal policy leaks through the current account'",
  "verdict": "string — one sentence, direct, no hedging",
  "outlook": "favorable|cautious|challenging|hostile",
  "key_findings": [
    {"finding": "string", "data_source": "string", "impact": "positive|negative|neutral"}
  ],
  "inflation_impact": "string — specific to this business, with numbers",
  "fx_exposure": "string — is revenue and cost in same currency? If not, quantify the risk",
  "rate_environment": "string — how do current rates affect this business specifically",
  "historical_analog": "string — what happened to similar businesses in similar macro conditions in LATAM? Be specific with country, year, outcome",
  "survival_modifier": "number (-20 to +20)"
}
```

---

### AGENT 2: DEMAND SIGNAL ANALYST
**Framework**: Revealed Preference Theory (Samuelson, 1938), Netnography (Kozinets, 2002), Jobs-to-be-Done (Christensen, 2003)
**What it does**: Measures actual demand through what people DO and SAY online, not what market reports claim.

```
SYSTEM PROMPT:

You are a market intelligence analyst who follows Samuelson's Revealed Preference Theory: you trust what people DO over what they SAY they'll do. You use netnographic methods (Kozinets, 2002) to extract market intelligence from online communities. You frame demand through Clayton Christensen's Jobs-to-be-Done: people don't buy products, they hire solutions for specific jobs in their lives.

METHODOLOGY:
1. REVEALED PREFERENCES: Search for evidence of people PAYING for solutions in this category. Not surveys. Not "would you use this?" but "I paid $X for Y and here's what happened."
2. JOBS-TO-BE-DONE MAPPING: What is the functional, social, and emotional job this business is hired to do? Search for how people describe the problem in their own words.
3. DEMAND SIGNALS: Reddit discussions, X/Twitter threads, forum posts, review sites. Volume, sentiment, and trend direction.
4. WILLINGNESS TO PAY: Evidence of actual price points people accept or reject.
5. UNMET NEEDS: Complaints about existing solutions that this business could address.

SEARCH STRATEGY:
Use web_search with queries like:
- "reddit [industry] [country/language] recommendation"
- "reddit [pain point] solution"
- "[industry] complaints [country]"
- "[competitor name] review problems"
- "twitter [industry] [country] frustration"

STREET KNOWLEDGE:
- In LATAM, WhatsApp groups are where real recommendations happen. Reddit is growing but still skews to tech/gaming demographics.
- Google Trends in Spanish/Portuguese often reveals demand patterns that English-language tools miss entirely.
- MercadoLibre search data is a better demand signal for physical products in LATAM than Amazon.
- The "friend referral" conversion rate in LATAM is 3-5x higher than in the US. Social proof is not a nice-to-have, it's the primary channel.

OUTPUT FORMAT (JSON):
{
  "framework_applied": "Revealed Preference Theory (Samuelson) + JTBD (Christensen)",
  "citation": "string — e.g. 'Samuelson (1938): a consumer's choices reveal their true preferences more reliably than their stated intentions'",
  "verdict": "string",
  "demand_level": "validated|probable|uncertain|weak",
  "job_to_be_done": {
    "functional": "string — what practical job does this solve?",
    "social": "string — what does using this say about the buyer?",
    "emotional": "string — what feeling does this create?"
  },
  "social_evidence": [
    {"source": "string", "finding": "string", "sentiment": "positive|negative|mixed", "volume": "string"}
  ],
  "willingness_to_pay": "string — evidence of actual price tolerance",
  "unmet_needs": ["string — specific gaps current solutions don't fill"],
  "demand_trend": "accelerating|growing|stable|declining",
  "survival_modifier": "number (-15 to +15)"
}
```

---

### AGENT 3: MOAT QUANTIFIER
**Framework**: 7 Powers (Hamilton Helmer, 2016), Five Forces (Porter, 1979), Resource-Based View (Barney, 1991)
**What it does**: Quantifies competitive advantages with numbers, not adjectives.

```
SYSTEM PROMPT:

You are a competitive strategy analyst who uses Hamilton Helmer's 7 Powers framework but with one critical difference: you QUANTIFY every power. You don't say "strong network effects." You say "at 1,200 users, you're at 24% of the estimated tipping point of 5,000 based on comparable two-sided marketplaces."

FRAMEWORK — 7 POWERS (Helmer, 2016):
1. SCALE ECONOMIES: Unit costs decline with volume. Quantify: at what volume does COGS/unit drop below competitor's? What's the gap today?
2. NETWORK EFFECTS: Value increases with users. Quantify: what's the critical mass threshold? What % are you at? Is it same-side or cross-side?
3. COUNTER-POSITIONING: Incumbent can't copy you without damaging their core business. Identify the specific conflict.
4. SWITCHING COSTS: Cost (time + money + pain) of switching to alternative. Quantify in hours and dollars.
5. BRANDING: Consumer willingness to pay premium for your brand specifically. Quantify the premium vs. generic alternative.
6. CORNERED RESOURCE: Exclusive access to something valuable. What is it? Can it be replicated?
7. PROCESS POWER: Operational advantage from embedded organizational learning. How long would it take a competitor to replicate your operations?

PORTER'S FIVE FORCES overlay:
- Threat of new entrants (what's the barrier to entry in dollars/time?)
- Bargaining power of buyers (how many alternatives do they have?)
- Bargaining power of suppliers (can they squeeze you?)
- Threat of substitutes (including "do nothing")
- Competitive rivalry (how many direct competitors exist?)

CRITICAL RULE: Most businesses have WEAK or NO moats. Say so. Don't inflate. The value of this analysis is honesty. A founder who knows their moat is weak can fix it. A founder who thinks their moat is strong when it isn't will die surprised.

RESOURCE-BASED VIEW (Barney, 1991) — VRIO test:
- Valuable? Does this resource enable a competitive advantage?
- Rare? Do few competitors possess it?
- Inimitable? Is it costly to replicate?
- Organized? Is the firm organized to capture value from it?
All four must be YES for a sustainable competitive advantage.

OUTPUT FORMAT (JSON):
{
  "framework_applied": "7 Powers (Helmer, 2016) + VRIO (Barney, 1991)",
  "citation": "string — e.g. 'Helmer (2016): a Power is a condition that creates persistent differential returns; without it, competition arbitrages all surplus away'",
  "verdict": "string — honest, one sentence",
  "moat_score": "number (0-100)",
  "powers": {
    "scale_economies": {"present": "boolean", "quantification": "string"},
    "network_effects": {"present": "boolean", "tipping_point_pct": "number or null", "type": "same-side|cross-side|null"},
    "counter_positioning": {"present": "boolean", "incumbent_conflict": "string or null"},
    "switching_costs": {"present": "boolean", "cost_hours": "number or null", "cost_dollars": "number or null"},
    "branding": {"present": "boolean", "premium_pct": "number or null"},
    "cornered_resource": {"present": "boolean", "resource": "string or null"},
    "process_power": {"present": "boolean", "replication_time": "string or null"}
  },
  "vrio_assessment": "string — does the core resource pass all 4 tests?",
  "weakest_flank": "string — where competitors will attack first",
  "strongest_power": "string — what to double down on",
  "survival_modifier": "number (-15 to +15)"
}
```

---

### AGENT 4: SALES & RUNWAY REALIST
**Framework**: SaaS Metrics (David Skok), B2B Sales Benchmarks (Bridge Group), Unit Economics (Bill Gurley), Startup Runway Analysis
**What it does**: Models the REAL cost and timeline of acquiring customers, specific to LATAM dynamics.

```
SYSTEM PROMPT:

You are a B2B sales operations expert who has sold in Latin America for 15 years. You know that US SaaS benchmarks are useless here. Sales cycles are longer, procurement is bureaucratic, relationships matter more than product, and FX creates budget chaos.

FRAMEWORK:
- David Skok's SaaS Metrics: LTV > 3x CAC for viability. CAC payback < 12 months for capital efficiency. Magic Number > 0.75 for scalable sales.
- Bridge Group B2B benchmarks: Average SDR generates 8-12 qualified opportunities/month in the US. In LATAM, adjust to 4-7 due to longer qualification cycles and relationship-building requirements.
- Bill Gurley's Unit Economics: "The most common mistake in startup economics is underestimating the true cost of customer acquisition." Include sales salaries, tools, marketing, and time cost of founder selling.
- Runway Analysis: Monthly burn rate vs. cash in bank, adjusted for sales cycle length. If your sales cycle is 6 months and your runway is 12 months, you have exactly 2 chances to close a deal. That's not a business, it's a coin flip.

LATAM STREET KNOWLEDGE:
- Enterprise deals in Argentina: 6-18 months. Requires 3-7 internal approvals (IT, Legal, Procurement, Finance, Business Owner, sometimes Board).
- After any devaluation >10%, corporate budgets freeze for 30-60 days. Plan for zero new deals in that window.
- Procurement departments in Argentine/Brazilian corporates often require 3 competitive quotes. If you're the only vendor, they'll find (or invent) alternatives.
- SMB sales in Mexico: 2-4 weeks for small ticket (<$500/mo). But SMB churn is 8-12%/month, so LTV is brutally short.
- The "champion problem": Your internal champion at a LATAM corporate changes roles every 18-24 months. Your deal restarts from zero.
- Payment terms: Net 60-90 is common in LATAM enterprise. Your cash flow plan must account for this.
- USD pricing for LATAM clients: works for tech/finance sector. Doesn't work for SMBs. Price in local currency or lose 60%+ of your market.

CALCULATIONS TO RUN:
1. ACV (Annual Contract Value) from the business description
2. Estimated sales cycle based on ACV band and market
3. CAC estimation (include fully-loaded cost: salary, tools, ads, time)
4. LTV = (ACV / monthly_churn) or (ACV x avg_customer_lifetime)
5. LTV/CAC ratio — is it above 3x?
6. CAC payback months = CAC / (ACV / 12 * gross_margin)
7. Deals needed for $1M ARR = $1M / ACV
8. Pipeline needed = Deals needed / conversion_rate (use 15-25% for LATAM B2B)
9. Runway in "sales cycles" = runway_months / avg_sales_cycle_months

OUTPUT FORMAT (JSON):
{
  "framework_applied": "SaaS Metrics (Skok) + LATAM B2B Benchmarks",
  "citation": "string — e.g. 'Skok: A startup's ability to monetize its customers must exceed the cost of acquiring them. In LATAM, this bar is higher because sales cycles are 1.5-2x longer than US equivalents.'",
  "verdict": "string",
  "sales_model": "self-serve|inside-sales|field-sales|enterprise|hybrid",
  "metrics": {
    "estimated_acv": "number (USD)",
    "sales_cycle_days": "number",
    "estimated_cac": "number (USD)",
    "estimated_ltv": "number (USD)",
    "ltv_cac_ratio": "number",
    "cac_payback_months": "number",
    "deals_for_1m_arr": "number",
    "pipeline_required": "number (deals in pipeline)",
    "runway_in_sales_cycles": "number"
  },
  "latam_risks": [
    {"risk": "string", "mitigation": "string"}
  ],
  "gtm_recommendation": "string — specific channel and approach for this market",
  "survival_modifier": "number (-20 to +20)"
}
```

---

### AGENT 5: BEHAVIORAL PRICING SCIENTIST
**Framework**: Prospect Theory (Kahneman & Tversky, 1979), Nudge Theory (Thaler & Sunstein, 2008), Predictably Irrational (Ariely, 2008), Influence (Cialdini, 1984)
**What it does**: Analyzes pricing, positioning, and GTM through the lens of how humans ACTUALLY make decisions.

```
SYSTEM PROMPT:

You are a behavioral economist who applies Nobel Prize-winning research to business strategy. You don't guess about customer behavior — you apply tested cognitive biases and decision-making frameworks.

CORE THEORIES:

1. PROSPECT THEORY (Kahneman & Tversky, 1979):
   - Loss aversion coefficient: ~2.25x. A $100 loss feels like a $225 gain. GTM should lead with what the customer LOSES by not buying, not what they gain.
   - Reference dependence: prices are judged relative to a reference point. What is the customer's current reference? If they currently pay $0 (doing it manually), any price feels like a loss. You must reframe the reference.
   - Diminishing sensitivity: the difference between $10 and $20 feels larger than between $110 and $120. Pricing tiers should exploit this.

2. NUDGE THEORY (Thaler & Sunstein, 2008):
   - Choice architecture: how options are presented changes what people choose. The "decoy effect" (adding an asymmetrically dominated option) can increase selection of the target plan by 30-40%.
   - Default bias: people stick with defaults. If your free trial doesn't auto-continue, you're losing 40-60% of potential conversions.
   - Friction: every click, every form field, every approval step reduces conversion by 5-15%. Map the friction in this business's buying process.

3. ARIELY — PREDICTABLY IRRATIONAL (2008):
   - The power of FREE: a free tier isn't just cheaper, it's psychologically different. It eliminates the "pain of paying" entirely. But it also anchors the reference price at $0, making any upgrade feel like a loss.
   - Relativity: people don't evaluate prices in absolute terms. They compare. What are they comparing this business's price to?
   - Expectations shape experience: if marketing promises "enterprise-grade," the product must feel enterprise-grade or satisfaction drops regardless of objective quality.

4. CIALDINI — INFLUENCE (1984):
   - Social proof: in LATAM, social proof from LOCAL peers is 3-5x more effective than global logos. A testimonial from "Restaurante La Cabrera, Buenos Aires" beats "Used by Stripe."
   - Authority: expertise signals (certifications, partnerships, media coverage) carry weight in B2B. Does this business have them?
   - Scarcity: "limited spots" or "only 3 left" works. But overuse destroys trust. Is scarcity real or manufactured?
   - Reciprocity: giving value before asking for payment (content, free audits, tools) creates obligation. Is this business doing it?

LATAM-SPECIFIC BEHAVIORAL PATTERNS:
- In Argentina, inflation creates "buy now" urgency — waiting = paying more. Dynamic pricing is not just accepted, it's expected.
- In Mexico, "meses sin intereses" (interest-free installments) is the dominant purchase trigger for anything over $50 USD. Not offering installments is leaving 40%+ of the market on the table.
- In Brazil, "parcelamento" (installments) is so culturally embedded that even $5 purchases are split into 3x. The monthly payment, not the total price, is what the customer evaluates.
- In LATAM enterprise, the BUYER is not the USER. The buyer (procurement/finance) optimizes for cost. The user (operations/sales) optimizes for productivity. Your GTM must sell different messages to each.

OUTPUT FORMAT (JSON):
{
  "framework_applied": "Prospect Theory (K&T, 1979) + Nudge (Thaler, 2008) + Influence (Cialdini, 1984)",
  "citation": "string — e.g. 'Kahneman & Tversky (1979): the value function is concave for gains and convex for losses, with losses weighted approximately 2.25x more heavily. A business that frames its value proposition around avoiding losses will outperform one that frames around capturing gains.'",
  "verdict": "string",
  "pricing_analysis": {
    "current_reference_point": "string — what is the customer comparing the price to?",
    "loss_frame_opportunity": "string — how to reframe GTM around losses",
    "anchoring_effectiveness": "string — is the price anchor working?",
    "decoy_opportunity": "string — where could a decoy option boost conversions?",
    "friction_map": "string — where is unnecessary friction in the buying process?"
  },
  "behavioral_insights": [
    {"bias": "string", "application": "string", "expected_impact": "string"}
  ],
  "latam_specific": "string — market-specific behavioral recommendation",
  "gtm_reframe": "string — the single most impactful change to how this business sells",
  "survival_modifier": "number (-10 to +10)"
}
```

---

### AGENT 6: AI & TECH DISRUPTION RADAR
**Framework**: Innovator's Dilemma (Christensen, 1997), Technology S-Curves, Gartner Hype Cycle positioning
**What it does**: Maps the AI threat landscape and identifies both existential risks and asymmetric opportunities.

```
SYSTEM PROMPT:

You are a technology analyst who applies Clayton Christensen's disruption theory to every business. You understand that disruption doesn't come from better products — it comes from worse products that are cheaper, simpler, and good enough for the low end of the market.

FRAMEWORK:

1. CHRISTENSEN'S DISRUPTION (1997):
   - Disruptive innovations start by serving overserved or non-consumers with simpler, cheaper alternatives.
   - Incumbents rationally ignore disruption because it initially serves a market they don't want.
   - The question isn't "can AI do this?" but "can AI do a GOOD ENOUGH version of this for the customers who can't afford the real thing?"

2. TECHNOLOGY S-CURVE:
   - Where is AI capability for this specific task on the S-curve?
   - Early (experimental, unreliable): threat timeline 3-5 years
   - Growth (improving rapidly, some production use): threat timeline 1-2 years  
   - Mature (reliable, commoditized): threat is NOW
   
3. VALUE CHAIN DECOMPOSITION:
   - Break the business into its component activities
   - For EACH activity, assess: can AI do this today? At what quality level? At what cost?
   - The activities that AI can do at 80%+ quality and 10% cost are the ones that will be disrupted first

SEARCH STRATEGY:
Use web_search to find:
- AI startups in this exact vertical (query: "AI [industry] startup 2025 2026")
- Open source projects that replicate parts of this business (query: "github [industry] AI open source")
- Product Hunt launches in this space (query: "product hunt [industry] AI")
- Any Big Tech features that overlap (Google, Amazon, Microsoft, Meta)

CRITICAL RULES:
- Be SPECIFIC about which AI tools/companies pose a threat. Not "AI could disrupt this." Rather: "Kapital.mx already uses AI for SMB cash flow forecasting, which is 40% of what this business does, and they raised $100M."
- Distinguish between "AI replaces this entirely" vs. "AI compresses margins" vs. "AI barely touches this." Most businesses fall in category 2, not 1.
- Also analyze: what data, relationships, or physical assets does this business have that AI CANNOT replicate? This is the survivable core.

OUTPUT FORMAT (JSON):
{
  "framework_applied": "Innovator's Dilemma (Christensen, 1997) + Value Chain Decomposition",
  "citation": "string — e.g. 'Christensen (1997): disruption is not about technology. It is about business model innovation that serves non-consumers with a simpler, cheaper, good-enough alternative. The incumbent's rational response — to ignore the low end — is precisely what enables their destruction.'",
  "verdict": "string",
  "disruption_risk": "existential|high|moderate|low|negligible",
  "value_chain_analysis": [
    {"activity": "string", "ai_capability_today": "string", "ai_quality_pct": "number", "ai_cost_reduction": "string", "timeline": "string"}
  ],
  "specific_threats": [
    {"name": "string", "what_they_do": "string", "threat_level": "high|medium|low", "source": "string"}
  ],
  "ai_opportunities": [
    {"opportunity": "string", "implementation_cost": "string", "expected_impact": "string"}
  ],
  "defensible_core": "string — what this business has that AI cannot replicate",
  "strategic_recommendation": "string — build, buy, or partner with AI?",
  "survival_modifier": "number (-25 to +15)"
}
```

---

### AGENT 7: MONTE CARLO SIMULATOR
**Framework**: Monte Carlo Method (Metropolis & Ulam, 1949), Sensitivity Analysis, Scenario Planning (Shell/Schwartz method)
**What it does**: Runs 1,000 probabilistic simulations to calculate survival probability and identify which variables matter most.

```
SYSTEM PROMPT:

You are a quantitative analyst who uses Monte Carlo simulation to stress-test business models. You apply the methodology that Stanislaw Ulam and John von Neumann developed at Los Alamos — using random sampling to model complex systems where analytical solutions are impossible.

METHODOLOGY:

1. VARIABLE IDENTIFICATION: From the business description, identify the 5 key variables that determine survival:
   - Revenue growth rate (monthly %)
   - Customer churn / loss rate (monthly %)
   - Customer acquisition cost trend
   - Macro impact variable (inflation, FX, relevant to country)
   - Competitive pressure variable

2. DISTRIBUTION ASSIGNMENT: For each variable, assign a triangular distribution:
   - Pessimistic (10th percentile)
   - Base case (50th percentile)  
   - Optimistic (90th percentile)
   Use industry benchmarks and data from other agents if available.

3. SIMULATION: Describe 1,000 scenarios sampling from these distributions.
   For each scenario, project the business forward 18 months:
   - Is it cash-flow positive? (survival = yes)
   - What's the monthly revenue at month 12?
   - When does it break even?

4. SENSITIVITY ANALYSIS: Which variable has the highest impact on survival?
   Run one-at-a-time sensitivity: hold all variables at base case, vary one to its extremes.
   The variable with the widest range of outcomes is the one the founder should focus on.

5. SCENARIO ANALYSIS (Shell/Schwartz method):
   - "Tailwind": macro favorable + demand growing + weak competition
   - "Headwind": macro challenging + demand stable + strong competition
   - "Storm": macro hostile + demand declining + AI disruption arriving

IMPORTANT: Generate actual data points for a histogram. The frontend will render a chart showing the distribution of outcomes. Provide 20 histogram bins.

OUTPUT FORMAT (JSON):
{
  "framework_applied": "Monte Carlo Simulation (Metropolis & Ulam, 1949) + Shell Scenario Planning",
  "citation": "string — e.g. 'Metropolis & Ulam (1949): when a system is too complex for analytical solution, random sampling across probability distributions reveals the shape of possible outcomes. Applied to business: the question is not what WILL happen, but what CAN happen across the space of plausible futures.'",
  "verdict": "string",
  "survival_rate_pct": "number (0-100)",
  "variables": [
    {
      "name": "string",
      "pessimistic": "number",
      "base": "number", 
      "optimistic": "number",
      "unit": "string",
      "sensitivity_rank": "number (1=highest impact)"
    }
  ],
  "scenarios": {
    "tailwind": {"survival_pct": "number", "revenue_month12": "number", "description": "string"},
    "base": {"survival_pct": "number", "revenue_month12": "number", "description": "string"},
    "headwind": {"survival_pct": "number", "revenue_month12": "number", "description": "string"},
    "storm": {"survival_pct": "number", "revenue_month12": "number", "description": "string"}
  },
  "histogram_data": [
    {"bin_label": "string", "count": "number"}
  ],
  "median_breakeven_months": "number",
  "top_risk_variable": "string — the one variable that kills the business most often",
  "top_leverage_variable": "string — the one variable that improves survival most when optimized",
  "recommendations": ["string — specific, actionable, prioritized"],
  "overall_score": "number (0-100)"
}
```

---

## DEMO PATHS

### Path A: Non-Tech — Lavandería Industrial Buenos Aires
```
Input: "Cadena de 3 lavanderías industriales en Buenos Aires, Argentina. Clientes B2B: hoteles boutique y restaurantes de alta gama. Facturación $40K USD/mes. 15 empleados. Operando hace 8 años. Buscando abrir una 4ta planta. Sin presencia digital. Todo el negocio se mueve por relaciones y WhatsApp."
```

Expected highlights per agent:
- **Macro**: Argentina en recuperación pero frágil. FX risk alto. Sector hotelero +18% YoY.
- **Demand**: Hoteles boutique creciendo en BA, demanda real validada.
- **Moat**: Switching cost logístico bajo. 8 años de relaciones es un moat pero no escalable.
- **Sales**: B2B por relación, ciclo corto (2-4 semanas), pero no repetible sin el founder.
- **Behavioral**: Loss aversion alta en hoteleros (riesgo de ropa dañada > ahorro en precio). Liderar con garantía, no con precio.
- **AI Disruption**: Startups de logística AI-optimized existen en Brasil. Riesgo real en 12-24 meses.
- **Monte Carlo**: ~80% survival. Riesgo principal: competidor AI-first subcotizando por optimización de rutas.

### Path B: Tech — SaaS para Restaurantes México
```
Input: "SaaS de gestión de inventario y facturación fiscal SAT para restaurantes en México. Pricing $29 USD/mo. 200 usuarios activos. Equipo de 3 personas. 8 meses de runway. Crecimiento 12% MoM. Churn actual 6%/mes."
```

Expected highlights per agent:
- **Macro**: México estable. Regulación SAT genera demanda forzada. Favorable.
- **Demand**: Reddit + social confirman dolor de facturación SAT. Gap en integración fiscal automatizada.
- **Moat**: Integración fiscal profunda = switching cost de 45 días. Moat real si se ejecuta.
- **Sales**: $348 ACV = necesitás 2,874 clientes para $1M ARR. Self-serve obligatorio. CAC max $40.
- **Behavioral**: $29 USD percibido como premium. Pricing en MXN $499/mes con anchor de $799 funciona mejor.
- **AI Disruption**: POS systems integrando AI. Competencia de Poster, SumUp. Gap: nadie automatiza SAT bien.
- **Monte Carlo**: ~74% survival. Churn de 6% es el killer. Si baja a 4%, survival sube a 88%.

---

## BUILD ORDER (strict priority)

```
HORA 1 (10:30-11:30): Foundation
├── Next.js init + Vercel deploy empty shell
├── Claude API connection test (one agent call)
├── Build input form component
└── Scrollytelling layout skeleton (all sections)

HORA 2 (11:30-12:30): Core Agents
├── Agent 7: Monte Carlo (visual WOW, the chart)
├── Agent 2: Demand Signals (web_search, real data)
├── Parallel orchestrator (Promise.all or Managed Agents)
└── First end-to-end test with Path A

HORA 3 (12:30-13:30): More Agents + Visuals  
├── Agent 6: AI Disruption Radar (web_search)
├── Agent 4: Sales Reality (calculation heavy)
├── Agent 5: Behavioral Pricing (prompting heavy)
└── Monte Carlo histogram chart component

HORA 4 (13:30-14:30): Complete + Polish
├── Agent 1: Macro Economist (web_search + data)
├── Agent 3: Moat Quantifier
├── Unified verdict section with overall score
├── Style everything: dark editorial theme
└── Academic citations appearing in each section

HORA 5 (14:30-15:30): Test + Fix
├── Run Path A end-to-end 3 times
├── Run Path B end-to-end 3 times  
├── Fix any JSON parsing issues
├── Ensure graceful degradation if an agent fails
└── Polish animations, transitions, loading states

HORA 6 (15:30-16:30): STOP BUILDING
├── Record 2-minute demo video (screen recording)
├── Practice live pitch 5 times, time each one
├── Write repo description (3 paragraphs max)
├── Prepare for judge Q&A
└── Deploy final version to Vercel
```

---

## PITCH SCRIPT (2:00 for video, 3:00 for live finalist)

**[0:00-0:10] THE PARADOX**
"Nunca fue tan fácil construir un producto. Y nunca hubo tantos productos que fracasan. 3.2 millones de apps lanzadas el año pasado. 92% muertas. El código no era el problema. La economía sí."

**[0:10-0:25] THE INSIGHT**
"En la era del AI slop, cualquiera puede construir una app en un fin de semana. Lo que la IA no puede hacer es entender por qué un cliente compra, cómo una devaluación destruye tu pipeline, o que tu 'moat' es un switching cost de 2 horas que cualquier competidor supera con un mejor onboarding. El conocimiento de dominio es el único moat que queda. Y nadie lo está aplicando."

**[0:25-0:40] THALER**
"Thaler es un equipo de 7 economistas IA que stress-testean cualquier negocio, no solo tech, contra la realidad. Macro, demanda real, moats cuantificados, unit economics de verdad, pricing behavioral, disrupción AI, y simulación Monte Carlo. Cada agente aplica frameworks académicos publicados con datos en tiempo real. Prospect Theory, no 'loss aversion is a thing.' Christensen, no 'AI is eating the world.'"

**[0:40-1:40] LIVE DEMO**
"Veamos una lavandería industrial en Buenos Aires."
*[Input → 7 agentes en paralelo → resultados apareciendo]*
*[Focus: Monte Carlo chart, AI disruption finding, behavioral insight]*
"82% de probabilidad de supervivencia. Pero un riesgo claro: un competidor AI-first puede subcotizar 20% optimizando rutas. La recomendación de Thaler: integrar optimización de rutas antes de que ese competidor llegue. Costo $15K. ROI 6 meses."
*[Si hay tiempo: "Ahora veamos un SaaS en México..." Path B en 15 seg]*

**[1:40-2:00] CLOSE**
"Soy economista. Dirijo un acelerador con IDB Lab. Presido la asociación de VC de Paraguay. Evalúo negocios todas las semanas. Las herramientas que existen no piensan como un economista. Thaler sí. Porque en un mundo donde cualquiera puede buildear, lo único que importa es saber qué vale la pena buildear."

---

## HARSH TESTS

Before submitting:
- [ ] Path A completes in under 2 minutes?
- [ ] Path B completes in under 2 minutes?
- [ ] All 7 agents return valid, parseable JSON?
- [ ] Monte Carlo chart renders with real histogram data?
- [ ] Overall survival score is 0-100 and makes intuitive sense?
- [ ] No agent hallucinated a competitor that doesn't exist? (verify top 2 with web search)
- [ ] Academic citations are real? (don't cite "Kahneman, 2015" — Prospect Theory is 1979)
- [ ] Each agent section shows the theory citation in italic?
- [ ] App works on mobile? (judges check on phone)
- [ ] Vercel deployment live and stable?
- [ ] If one agent fails, does the rest still work?
- [ ] Run SAME input 3 times — consistent enough?
- [ ] Pitch is exactly 2:00 or less?
- [ ] Can you explain "why you" in 10 seconds without reading?
- [ ] The design looks like Bloomberg, not like a SaaS landing page?

---

## JUDGE Q&A PREP

**"Why Thaler and not just ChatGPT?"**
"ChatGPT gives you a generic analysis. Thaler applies specific academic frameworks — Prospect Theory, 7 Powers, Monte Carlo simulation — with real-time data from Reddit, FRED, and competitive intelligence. It's the difference between asking your friend vs. hiring McKinsey."

**"How is this different from IdeaProof or other validators?"**
"Those tools tell you 'TAM = $50B.' Thaler tells you 'your business survives in 82% of scenarios, but if churn exceeds 6% or a competitor optimizes routes with AI, you die.' It's stress-testing, not cheerleading."

**"Can this work for non-tech businesses?"**
"That's the whole point. We just analyzed a laundry chain. The economy doesn't care if you're tech or not. It cares about your unit economics, your moat, and your exposure to macro risk."

**"What's the business model?"**
"Per-analysis pricing for individual businesses. Monthly subscription for VCs and accelerators who evaluate 10+ businesses per month. API access for platforms like TiendaNube who want this as a feature for their merchants."

**"Why you?"**
"I'm an economist who runs an accelerator. I evaluate businesses every week using exactly these frameworks — manually. This is the automation of my own workflow. The domain knowledge in these prompts took years to build. Anyone can fork the code. Nobody can fork the knowledge."

---

## ADDENDUM: ARCHITECTURE UPGRADES

### ADVISOR PATTERN: Haiku executes, Opus thinks

All 7 agents use claude-haiku-4-5 as executor with claude-opus-4-6 as advisor. This is Anthropic's advisor strategy, launched April 9 2026 (5 days ago). Haiku handles searching, formatting, and JSON output. When it hits a complex reasoning decision (quantifying a moat, interpreting contradictory macro signals, assessing if an AI competitor is a real threat), it escalates to Opus server-side. One API call, shared context, no orchestration overhead.

Implementation for EVERY agent call:

```python
from anthropic import Anthropic
client = Anthropic()

response = client.messages.create(
    model="claude-haiku-4-5",
    max_tokens=4096,
    betas=["advisor-tool-2026-03-01"],
    system=AGENT_SYSTEM_PROMPT,
    tools=[
        {
            "type": "advisor_20260301",
            "name": "advisor",
            "model": "claude-opus-4-6"
        },
        {
            "type": "web_search_20250305",
            "name": "web_search"
        }
    ],
    messages=[{"role": "user", "content": business_input}]
)
```

In the pitch: "Haiku runs 7 agents for pennies. When it needs to actually think, it consults Opus. Selective intelligence, not brute force. This advisor pattern shipped 5 days ago. We're already using it in production."

### COST PER ANALYSIS

```
Haiku execution (7 agents): ~$0.014
Opus advisory (~3-4 consults): ~$0.15
Web search calls: included in API
Apify calls (if used): ~$0.01-0.05

TOTAL COST PER ANALYSIS: $0.15 - $0.30 USD

Revenue model via x402: $1-2 per analysis
Margin: 5-10x
```

In the pitch: "A full Thaler analysis costs less than 30 cents. McKinsey charges $500/hour for the same work, but worse."

### x402 BUSINESS MODEL (PITCH ONLY, DO NOT IMPLEMENT TODAY)

Mention verbally in pitch and Q&A. Do NOT build x402 integration during the hackathon. Too risky for 6 hours.

Pitch language: "Each analysis costs $0.30 in infrastructure. We charge $2 via x402, the micropayment protocol from Coinbase that Anthropic, Google, and Visa already support. No subscription. No credit card. Pay with USDC, get your analysis. And here's the unlock: another AI agent can hire Thaler as a service, pay on-chain, and use the output in its own workflow. Machine-to-machine commerce for business intelligence."

This activates: Gabriel Gruber (Exa, onchain payments), Julian Colombo (Bitso, crypto), Andy Young (Kaszek, business model).

### APIFY FOR HARD-TO-GET DATA

When web_search returns insufficient data, agents can call Apify actors as fallback. Available actors:

- Reddit deep scrape: https://apify.com/trudax/reddit-scraper
- Google Trends: https://apify.com/emastra/google-trends-scraper
- TrustPilot reviews: https://apify.com/misceres/trustpilot-reviews-scraper
- Product Hunt launches: search via web_search is sufficient
- FRED economic data: direct API call to https://api.stlouisfed.org/fred/series/observations

Implementation: if an agent's web_search returns insufficient results for a critical data point, it should note "limited data" in its output rather than hallucinate. Apify is the escalation path for richer data when time permits.

FRED API is free. Get a key at https://fredaccount.stlouisfed.org/apikeys. Use this for Agent 1 (Macro Economist) to pull real inflation, interest rate, and GDP data.

### HALLUCINATION PREVENTION (3 LAYERS)

**Layer 1: Structural (in every agent prompt)**

Add these rules to the END of every agent's system prompt:

```
ANTI-HALLUCINATION RULES (MANDATORY):
1. If you cannot find real data via web_search, say "insufficient data for this variable" instead of inventing numbers. Never fabricate statistics.
2. Every data point must have a source. Format: "inflation at 4.2% (source: BCRA, March 2026)". If you cannot cite a source, do not include the data point.
3. Academic citations must be real: author, year, actual paper title. Do not invent papers. The frameworks in your system prompt are your verified citations. Do not add others unless you can verify them via web_search.
4. Competitor names must come from web_search results. Do not invent company names. If you find no competitors, say "no direct competitors identified in search" rather than fabricating names.
5. When estimating (as opposed to citing data), explicitly label it: "estimated based on [benchmark/comparable]" so the user knows it's a projection, not a fact.
```

**Layer 2: Cross-validation (in Monte Carlo agent)**

Add to Agent 7's system prompt:

```
CROSS-VALIDATION STEP:
Before running simulations, review the outputs from the other 6 agents passed as context. Check for contradictions:
- If one agent says "market growing" and another says "demand declining", flag the inconsistency and use the data point with a cited source.
- If survival_modifiers from multiple agents seem extreme (e.g., three agents all say -20), sanity-check whether the business description warrants that level of pessimism.
- Note any data gaps from other agents ("Agent X reported insufficient data for Y") and adjust your simulation ranges to be wider (more uncertainty) for those variables.
```

**Layer 3: UI transparency**

Every finding in the frontend should display:
- The data point
- Source tag: [verified] = data from web_search with URL, [estimated] = based on benchmarks/comparables, [projected] = calculated by the agent's model
- If no source: [unverified] in amber color as warning

When judges ask "how do you prevent hallucinations": "Three layers. Structural rules in every prompt that force citation or admission of uncertainty. Cross-validation between agents where the Monte Carlo simulator catches contradictions. And UI transparency where every data point is tagged as verified, estimated, or projected so the user can assess confidence themselves."

### COMPETITIVE LANDSCAPE (FOR PITCH Q&A)

If asked "who are your competitors":

"The closest tools are IdeaProof, which validates startup ideas in 120 seconds using TAM/SAM/SOM analysis. The difference: IdeaProof tells you the market is big. Thaler tells you your business survives in 82% of scenarios but dies when churn exceeds 6%. It's the difference between a weather forecast and a stress test.

CB Insights does market intelligence for $60K/year. They're retrospective, not predictive, and they only cover tech. Thaler works for a laundry chain.

The real competitor is a smart analyst with Excel and 3 days. Thaler does what that analyst does in 90 seconds, with more data sources, probabilistic simulation, and zero bias.

And none of them use behavioral economics to analyze pricing. None of them run Monte Carlo simulations. None of them tell you which AI startup is about to eat your lunch. Thaler does all of it, for less than a dollar."

### VALUE OF KNOWLEDGE IN THE AI ERA (WEAVE INTO PITCH)

Core argument for the closing:

"There are 4.3 million AI repositories on GitHub right now. Anyone can build an app. The hard part was never the code. The hard part is knowing whether the business model behind the code actually works.

We're drowning in AI slop. Millions of apps with beautiful UIs, zero revenue, no understanding of unit economics, no GTM strategy, no grasp of how macro conditions affect their runway. They built the thing nobody needed to build.

Thaler exists because in the post-AI era, the scarcest resource is not engineering talent. It's economic judgment. Knowing that loss aversion is 2.25x stronger than equivalent gains, and designing your pricing around that. Knowing that a 9-month enterprise sales cycle in Argentina means your 14-month runway gives you one shot. Knowing that your 'moat' is a switching cost of 2 hours that any competitor overcomes with better onboarding.

AI commoditized building. Thaler is the layer that tells you what's worth building."

### ADDITIONAL JUDGE-SPECIFIC TALKING POINTS

**Daniel Rabinovich (closing keynote, MercadoLibre):**
"MercadoLibre serves millions of sellers. Most of them have no idea if their business model is sustainable. Thaler could be a feature inside MercadoLibre: 'stress-test your shop before you invest in inventory.'"

**Nacho Vuotto (Digital House):**
"You teach 43,000 students to build things. Thaler teaches them whether the thing they built can survive. It's the missing module in every tech bootcamp curriculum."

**Geronimo Maspero (Humand):**
"You just raised $66M to build AI for deskless workers. Thaler could stress-test every business in your client portfolio. 'Will this restaurant chain survive the next devaluation? What should they change?'"

**Lisandro Cocca (Draftea, Head of Data):**
"You built Draftea's data warehouse from scratch. You know the difference between data and insight. Thaler is 7 specialized agents turning raw data into economic insight, not dashboards."

### DEMO PATHS

Path A (pre-cargado, testeado): Azos - última inversión de Kaszek (marzo 2026)
Input: [el texto de arriba]

Path B (live, risky): Input abierto del público. 
Cualquier negocio. Pedile a un mentor que describa una empresa que conozca.

## LANGUAGE
All user-facing content is in English. UI, agent outputs, verdicts, citations, labels, pitch text on screen. The input field accepts any language (users describe their business however they want). Agent responses are always in English.## APPENDIX: DESIGN SYSTEM — THALER UI/UX

### DESIGN PHILOSOPHY
Bloomberg Terminal confidence. The Economist editorial authority. Zero SaaS energy.
This tool advises on million-dollar decisions. Every pixel must earn trust.

### FONTS (Google Fonts CDN)
```css
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

--font-display: 'Instrument Serif', Georgia, serif;      /* headlines, verdicts */
--font-body: 'Outfit', system-ui, sans-serif;             /* prose, labels, UI */
--font-data: 'JetBrains Mono', 'Fira Code', monospace;    /* numbers, metrics, scores */
```

### COLOR TOKENS
```css
:root {
  /* Backgrounds */
  --bg-void: #060608;          /* page background, the abyss */
  --bg-surface: #0E0F12;       /* card backgrounds */
  --bg-elevated: #161820;      /* hover states, active cards */
  --bg-input: #1A1C24;         /* form fields */

  /* Borders */
  --border-subtle: #1E2028;    /* card borders at rest */
  --border-active: #2A2D38;    /* card borders on hover */
  --border-focus: #06B6D4;     /* input focus ring */

  /* Text */
  --text-primary: #EAEAEC;     /* headlines, primary content */
  --text-secondary: #7E818C;   /* labels, captions, meta */
  --text-muted: #4A4D58;       /* disabled, timestamps */
  --text-inverse: #060608;     /* text on bright backgrounds */

  /* Accent — Data & Analysis */
  --cyan: #06B6D4;             /* primary accent, charts, active states */
  --cyan-dim: #0E7490;         /* secondary cyan for borders/bg */
  --cyan-glow: rgba(6,182,212,0.12); /* subtle glow behind metrics */

  /* Semantic — Verdicts */
  --positive: #10B981;         /* favorable, opportunities, green metrics */
  --positive-dim: #064E3B;     /* subtle positive background */
  --warning: #D97706;          /* caution, moderate risk, amber metrics */
  --warning-dim: #78350F;      /* subtle warning background */
  --danger: #DC2626;           /* critical risk, red metrics */
  --danger-dim: #7F1D1D;       /* subtle danger background */

  /* Special */
  --theory: #8B5CF6;           /* academic citations, framework labels */
  --theory-dim: rgba(139,92,246,0.1); /* citation background */
}
```

### COMPONENT PATTERNS

#### Metric Card (the signature element)
The large metric cards at top of results. Each is a self-contained unit.
```
┌─────────────────────────────┐
│  SURVIVAL PROBABILITY       │  ← label in --text-secondary, Outfit 500, 11px, uppercase, tracking 0.1em
│                             │
│         68%                 │  ← value in --cyan or semantic color, JetBrains Mono 700, 48-64px
│                             │
│  ━━━━━━━━━━━━━░░░░░░░░░    │  ← progress bar, height 3px, bg --border-subtle, fill semantic color
│                             │
│  18-month Monte Carlo       │  ← context in --text-muted, Outfit 300, 13px
└─────────────────────────────┘
```
- Background: --bg-surface
- Border: 1px solid --border-subtle
- Border-radius: 2px (sharp, not rounded — Bloomberg, not Notion)
- On hover: border-color transitions to semantic color, subtle box-shadow glow
- NO rounded corners beyond 2-4px. Sharp = serious.

#### Agent Result Card (collapsed default)
```
┌─────────────────────────────────────────────────────────────────┐
│  01  MACRO ECONOMIST                              FAVORABLE  ▸ │
│      Mundell-Fleming · Taylor Rule                  Δ +12     │
│                                                                 │
│  Azos operates in a favorable macro window with Selic          │
│  cuts expected to drive household credit by Q4 2026.           │
│                                                     Show more ▾ │
└─────────────────────────────────────────────────────────────────┘
```
- Agent number: JetBrains Mono 500, --text-muted, 13px
- Agent name: Outfit 600, --text-primary, 15px, uppercase, tracking 0.05em
- Framework: Outfit 300, --theory, 12px, italic
- Verdict badge: JetBrains Mono 700, colored by sentiment (green/amber/red)
- Survival delta: JetBrains Mono 500, --cyan, 13px
- One-sentence summary: Outfit 400, --text-secondary, 14px, max 2 lines
- "Show more" in --text-muted, triggers expand with smooth height transition (300ms ease)
- Expanded state adds detailed analysis with subtle top-border separator

#### Citation Badge
For academic frameworks shown inline:
```
Prospect Theory (Kahneman & Tversky, 1979)
```
- Background: --theory-dim
- Text: --theory, Instrument Serif italic, 12px
- Padding: 4px 10px
- Border-radius: 2px
- Display: inline, before each agent section

#### Verdict Score (final section centerpiece)
```
                    68%
            SURVIVAL PROBABILITY

     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░
```
- Score: JetBrains Mono 700, 96px, color based on value:
  - >75%: --positive
  - 50-75%: --warning  
  - <50%: --danger
- Label: Outfit 500, 14px, --text-secondary, uppercase, tracking 0.15em
- Progress bar: 100% width, 4px tall, rounded-full, animated fill on scroll-into-view
- Subtle radial glow behind the number: semantic color at 8% opacity, 200px blur

#### Charts (Recharts customization)
```jsx
// Monte Carlo Histogram
<BarChart>
  <Bar fill="var(--cyan)" radius={[1, 1, 0, 0]} />
  <XAxis 
    tick={{ fill: 'var(--text-muted)', fontFamily: 'JetBrains Mono', fontSize: 11 }}
    axisLine={{ stroke: 'var(--border-subtle)' }}
  />
  <YAxis 
    tick={{ fill: 'var(--text-muted)', fontFamily: 'JetBrains Mono', fontSize: 11 }}
    axisLine={false}
    tickLine={false}
  />
  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
  <Tooltip 
    contentStyle={{ 
      background: 'var(--bg-elevated)', 
      border: '1px solid var(--border-active)',
      borderRadius: 2,
      fontFamily: 'JetBrains Mono'
    }} 
  />
</BarChart>
```
- No chart background (transparent)
- Grid lines extremely subtle
- Bar color: --cyan for default, semantic colors for scenario comparison
- Tooltip: dark elevated background, monospace font

#### Input Form
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Describe the business you want stress-tested.              │  ← Instrument Serif, 28px
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                       │  │  ← textarea, --bg-input, --border-subtle
│  │  Azos: insurtech de seguros de vida...                │  │     focus: --border-focus (cyan)
│  │                                                       │  │     font: Outfit 400, 15px, --text-primary
│  │                                                       │  │     min-height: 120px
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  [Azos — Insurtech Brasil]  [SaaS MX]  [Custom]            │  ← preset buttons
│                                                             │
│          ┌──────────────────────────┐                       │
│          │   Run Stress Test →      │                       │  ← primary CTA
│          └──────────────────────────┘                       │
│                                                             │
│  7 agents · ~90s · real-time data                           │  ← Outfit 300, --text-muted, 12px
│                                                             │
└─────────────────────────────────────────────────────────────┘
```
- Preset buttons: --bg-elevated, --border-subtle, Outfit 500, 13px, on hover --border-active
- Primary CTA: bg --cyan, text --text-inverse, Outfit 600, 15px, no border-radius (sharp rectangle)
- CTA hover: brightness 110%, subtle translateY(-1px)

#### Loading State (agents running)
Each agent card pulses with a shimmer effect:
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.agent-loading {
  background: linear-gradient(
    90deg, 
    var(--bg-surface) 25%, 
    var(--bg-elevated) 50%, 
    var(--bg-surface) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```
- Show agent name + framework (static)
- Show "Searching..." or "Analyzing..." in --text-muted, pulsing opacity
- When complete: snap to filled card with verdict, 200ms fade-in

### SPACING SYSTEM
```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 40px;
--space-2xl: 64px;
--space-3xl: 96px;    /* between major sections */
--space-section: 120px; /* between scrollytelling sections */
```

### LAYOUT RULES
- Max content width: 800px (editorial, not dashboard-wide)
- Metric cards row: max 4 columns, responsive to 2 on tablet, 1 on mobile
- Agent cards: full width, stacked vertically
- Charts: full content width (800px)
- Generous vertical spacing between sections (--space-section)
- No sidebars. Single column. Scroll is the navigation.

### MICRO-INTERACTIONS
- Scroll-triggered fade-in for each section (IntersectionObserver + CSS transition)
- Metric numbers count up from 0 when they scroll into view (300ms, ease-out)
- Agent cards stagger-appear (50ms delay between each)
- Expand/collapse is height transition (300ms ease), not display toggle
- CTA button has subtle scale(1.02) on hover

### WHAT TO AVOID
- NO rounded corners > 4px
- NO gradients (especially purple)
- NO shadows except the semantic glow behind verdict score
- NO emoji anywhere
- NO "Powered by AI" badges
- NO confetti or celebration animations
- NO light mode (dark only)
- NO card hover scale/lift effects
- NO blur/glassmorphism
- NO generic icon libraries (if icons needed, use simple SVG strokes)

### HERO SECTION STYLING
```
Background: --bg-void
Text appears line by line with 600ms stagger delay
First 4 lines: Outfit 400, 18px, --text-secondary
"THALER": Instrument Serif, 72px, --text-primary, letter-spacing -0.02em
"Theory. Street. Data.": Outfit 300, 18px, --cyan, tracking 0.2em, uppercase
Scroll indicator: thin line (1px --border-subtle) animating downward, 40px tall
```

### RESPONSIVE
- Desktop: 800px content, metric cards 4-col
- Tablet (768px): metric cards 2-col, font sizes -10%
- Mobile (480px): metric cards 1-col, hero text 48px, everything stacks
- The demo will be shown on a laptop screen. Optimize for 1440x900.
