export type AgentId =
  | "macro"
  | "demand"
  | "moat"
  | "sales"
  | "behavioral"
  | "ai_disruption"
  | "founder"
  | "monte_carlo";

export interface AgentMeta {
  id: AgentId;
  number: number;
  name: string;
  framework: string;
  dataSources: string[];
  survivalBounds: [number, number];
}

export const AGENT_META: Record<AgentId, AgentMeta> = {
  macro: {
    id: "macro",
    number: 1,
    name: "Macro Economist",
    framework: "Mundell-Fleming + Taylor Rule",
    dataSources: ["BCRA", "INDEC", "FRED", "World Bank"],
    survivalBounds: [-20, 20],
  },
  demand: {
    id: "demand",
    number: 2,
    name: "Demand Signal Analyst",
    framework: "Revealed Preference + Jobs-to-be-Done",
    dataSources: ["Reddit", "X/Twitter", "Google Trends", "MercadoLibre"],
    survivalBounds: [-15, 15],
  },
  moat: {
    id: "moat",
    number: 3,
    name: "Moat Quantifier",
    framework: "7 Powers (Helmer) + VRIO (Barney)",
    dataSources: ["Competitive filings", "Product data", "Public pricing"],
    survivalBounds: [-15, 15],
  },
  sales: {
    id: "sales",
    number: 4,
    name: "Sales & Runway Realist",
    framework: "SaaS Metrics (Skok) + LATAM B2B Benchmarks",
    dataSources: ["Bridge Group", "SaaStr", "Regional procurement data"],
    survivalBounds: [-20, 20],
  },
  behavioral: {
    id: "behavioral",
    number: 5,
    name: "Behavioral Pricing Scientist",
    framework: "Prospect Theory + Nudge + Influence",
    dataSources: ["Pricing benchmarks", "Conversion studies"],
    survivalBounds: [-10, 10],
  },
  ai_disruption: {
    id: "ai_disruption",
    number: 6,
    name: "AI & Tech Disruption Radar",
    framework: "Innovator's Dilemma (Christensen)",
    dataSources: ["GitHub", "Product Hunt", "Crunchbase", "arXiv"],
    survivalBounds: [-25, 15],
  },
  founder: {
    id: "founder",
    number: 7,
    name: "Founder Analysis",
    framework: "Founder-Problem Fit + Execution + Industry Depth",
    dataSources: ["LinkedIn", "Podcast transcripts", "Press interviews", "Crunchbase"],
    survivalBounds: [-15, 15],
  },
  monte_carlo: {
    id: "monte_carlo",
    number: 8,
    name: "Monte Carlo Simulator",
    framework: "Monte Carlo (Metropolis & Ulam, 1949)",
    dataSources: ["Cross-agent synthesis", "Scenario planning (Shell)"],
    survivalBounds: [-100, 100],
  },
};

export type SourceTag = "verified" | "estimated" | "projected" | "unverified";

export interface DataPoint {
  label: string;
  value: string | number;
  source?: string;
  tag: SourceTag;
}

export interface AgentResultBase {
  id: AgentId;
  name: string;
  framework_applied: string;
  citation: string;
  // Added: graceful-fallback fields
  partial?: boolean;
  rawText?: string;
  parseError?: string;
  elapsed_ms?: number;
  verdict: string;
  // Normalized to integer in range [-20, +20] when present.
  survival_modifier: number;
}

export interface MacroResult extends AgentResultBase {
  outlook: "favorable" | "cautious" | "challenging" | "hostile";
  key_findings: Array<{
    finding: string;
    data_source: string;
    impact: "positive" | "negative" | "neutral";
  }>;
  inflation_impact: string;
  fx_exposure: string;
  rate_environment: string;
  historical_analog: string;
}

export interface DemandResult extends AgentResultBase {
  demand_level: "validated" | "probable" | "uncertain" | "weak";
  job_to_be_done: {
    functional: string;
    social: string;
    emotional: string;
  };
  social_evidence: Array<{
    source: string;
    finding: string;
    sentiment: "positive" | "negative" | "mixed";
    volume: string;
  }>;
  willingness_to_pay: string;
  unmet_needs: string[];
  demand_trend: "accelerating" | "growing" | "stable" | "declining";
}

export interface MoatResult extends AgentResultBase {
  moat_score: number;
  powers: {
    scale_economies: { present: boolean; quantification: string };
    network_effects: {
      present: boolean;
      tipping_point_pct: number | null;
      type: "same-side" | "cross-side" | null;
    };
    counter_positioning: { present: boolean; incumbent_conflict: string | null };
    switching_costs: {
      present: boolean;
      cost_hours: number | null;
      cost_dollars: number | null;
    };
    branding: { present: boolean; premium_pct: number | null };
    cornered_resource: { present: boolean; resource: string | null };
    process_power: { present: boolean; replication_time: string | null };
  };
  vrio_assessment: string;
  weakest_flank: string;
  strongest_power: string;
}

export interface SalesResult extends AgentResultBase {
  sales_model:
    | "self-serve"
    | "inside-sales"
    | "field-sales"
    | "enterprise"
    | "hybrid";
  metrics: {
    estimated_acv: number;
    sales_cycle_days: number;
    estimated_cac: number;
    estimated_ltv: number;
    ltv_cac_ratio: number;
    cac_payback_months: number;
    deals_for_1m_arr: number;
    pipeline_required: number;
    runway_in_sales_cycles: number;
  };
  latam_risks: Array<{ risk: string; mitigation: string }>;
  gtm_recommendation: string;
}

export interface BehavioralResult extends AgentResultBase {
  pricing_analysis: {
    current_reference_point: string;
    loss_frame_opportunity: string;
    anchoring_effectiveness: string;
    decoy_opportunity: string;
    friction_map: string;
  };
  behavioral_insights: Array<{
    bias: string;
    application: string;
    expected_impact: string;
  }>;
  latam_specific: string;
  gtm_reframe: string;
}

export interface FounderResult extends AgentResultBase {
  score: number;
  founder_problem_fit: {
    score: number;
    evidence: string;
    gap: string | null;
  };
  execution_evidence: {
    score: number;
    previous_ventures: string;
    shipping_speed: string;
    adversity_tested: boolean;
  };
  industry_depth: {
    score: number;
    years_in_domain: number | null;
    key_relationships: string;
    regulatory_navigation: string;
  };
  team_composition: string;
  red_flags: string[];
}

export interface AIDisruptionResult extends AgentResultBase {
  disruption_risk: "existential" | "high" | "moderate" | "low" | "negligible";
  value_chain_analysis: Array<{
    activity: string;
    ai_capability_today: string;
    ai_quality_pct: number;
    ai_cost_reduction: string;
    timeline: string;
  }>;
  specific_threats: Array<{
    name: string;
    what_they_do: string;
    threat_level: "high" | "medium" | "low";
    source: string;
  }>;
  ai_opportunities: Array<{
    opportunity: string;
    implementation_cost: string;
    expected_impact: string;
  }>;
  defensible_core: string;
  strategic_recommendation: string;
}

export type OutcomeTier =
  | "dead"
  | "zombie"
  | "surviving"
  | "thriving"
  | "breakout";

export type FundingStage =
  | "Pre-seed"
  | "Seed"
  | "Series A"
  | "Series B"
  | "Series C";

export interface OutcomeDistribution {
  dead: number;
  zombie: number;
  surviving: number;
  thriving: number;
  breakout: number;
}

export interface MonteCarloResult extends AgentResultBase {
  survival_rate_pct: number;
  variables: Array<{
    name: string;
    pessimistic: number;
    base: number;
    optimistic: number;
    unit: string;
    sensitivity_rank: number;
  }>;
  scenarios: {
    tailwind: { survival_pct: number; revenue_month12: number; description: string };
    base: { survival_pct: number; revenue_month12: number; description: string };
    headwind: { survival_pct: number; revenue_month12: number; description: string };
    storm: { survival_pct: number; revenue_month12: number; description: string };
  };
  histogram_data: Array<{ bin_label: string; count: number }>;
  median_breakeven_months: number;
  top_risk_variable: string;
  top_leverage_variable: string;
  recommendations: string[];
  overall_score: number;
  outcome_distribution?: OutcomeDistribution;
  most_likely_outcome?: OutcomeTier;
  stage_context?: {
    stage: FundingStage;
    base_distribution: OutcomeDistribution;
    vs_base: string;
  };
}

export type AgentResult =
  | MacroResult
  | DemandResult
  | MoatResult
  | SalesResult
  | BehavioralResult
  | AIDisruptionResult
  | FounderResult
  | MonteCarloResult;

export interface StressReport {
  business_input: string;
  generated_at: string;
  results: Partial<Record<AgentId, AgentResult>>;
  errors: Partial<Record<AgentId, string>>;
  overall_score: number;
  latency_ms: number;
}
