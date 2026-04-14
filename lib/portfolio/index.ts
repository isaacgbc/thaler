import nubank from "./nubank.json";
import kavak from "./kavak.json";
import notco from "./notco.json";
import quintoandar from "./quintoandar.json";
import creditas from "./creditas.json";
import azos from "./azos.json";
import humand from "./humand.json";
import pomelo from "./pomelo.json";
import arvo from "./arvo.json";
import niva from "./niva.json";

export type PortfolioCategory = "legacy" | "recent";

export type FundingStage =
  | "Pre-seed"
  | "Seed"
  | "Series A"
  | "Series B"
  | "Series C";

export type OutcomeTier =
  | "dead"
  | "zombie"
  | "surviving"
  | "thriving"
  | "breakout";

export interface PortfolioScores {
  macro: number;
  demand: number;
  moat: number;
  sales: number;
  behavioral: number;
  ai_disruption: number;
  founder: number;
  simulation: number;
}

export interface FounderProfile {
  name: string;
  background: string;
  problem_fit: string;
  execution_evidence: string;
  red_flags: string;
}

export interface OutcomeDistribution {
  dead: number;
  zombie: number;
  surviving: number;
  thriving: number;
  breakout: number;
}

export interface StageContext {
  stage: FundingStage;
  base_distribution: OutcomeDistribution;
  vs_base: string;
}

export interface PortfolioCompany {
  company: string;
  category: PortfolioCategory;
  year_invested: number;
  round: string;
  stage_at_investment: FundingStage;
  stage_base_rate: number;
  description: string;
  current_status: string;
  scores: PortfolioScores;
  survival_pct: number;
  outcome_distribution: OutcomeDistribution;
  most_likely_outcome: OutcomeTier;
  stage_context: StageContext;
  verdict: string;
  top_risk: string;
  top_opportunity: string;
  actual_outcome: string | null;
  actual_outcome_tier: OutcomeTier | null;
  founder: FounderProfile;
}

export const PORTFOLIO: PortfolioCompany[] = [
  nubank,
  kavak,
  notco,
  quintoandar,
  creditas,
  azos,
  humand,
  pomelo,
  arvo,
  niva,
] as PortfolioCompany[];

export const SCORE_LABELS: Array<{ key: keyof PortfolioScores; label: string }> = [
  { key: "macro", label: "Macro" },
  { key: "demand", label: "Demand" },
  { key: "moat", label: "Moat" },
  { key: "sales", label: "Sales" },
  { key: "behavioral", label: "Behavioral" },
  { key: "ai_disruption", label: "AI resilience" },
  { key: "founder", label: "Founder" },
  { key: "simulation", label: "Simulation" },
];

export const TIER_ORDER: OutcomeTier[] = [
  "dead",
  "zombie",
  "surviving",
  "thriving",
  "breakout",
];

export interface TierColors {
  // Solid segment color used in distribution bars. Dark enough that white
  // percentage labels on top remain legible.
  segment: string;
  // Text color used on top of the solid segment color (for inline labels).
  onSegment: string;
  // Badge uses a soft tint bg + dark text for "light-mode" legibility — fixes
  // the prior white-on-white surviving-tier bug.
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export const TIER_META: Record<
  OutcomeTier,
  { label: string; icon: string; colors: TierColors }
> = {
  dead: {
    label: "Dead",
    icon: "×",
    colors: {
      segment: "#C4372A",
      onSegment: "#FFFFFF",
      badgeBg: "#FFF0EE",
      badgeText: "#C4372A",
      badgeBorder: "#F5D0CA",
    },
  },
  zombie: {
    label: "Zombie",
    icon: "◍",
    colors: {
      segment: "#B5850A",
      onSegment: "#FFFFFF",
      badgeBg: "#FFF9E6",
      badgeText: "#B5850A",
      badgeBorder: "#F0DFAE",
    },
  },
  surviving: {
    label: "Surviving",
    icon: "△",
    colors: {
      segment: "#8B8B8B",
      onSegment: "#FFFFFF",
      badgeBg: "#F0EFEB",
      badgeText: "#3D3D3D",
      badgeBorder: "#D4D1CA",
    },
  },
  thriving: {
    label: "Thriving",
    icon: "▲",
    colors: {
      segment: "#1A6B4E",
      onSegment: "#FFFFFF",
      badgeBg: "#E8F5EE",
      badgeText: "#1A6B4E",
      badgeBorder: "#C4E4D2",
    },
  },
  breakout: {
    label: "Breakout",
    icon: "★",
    colors: {
      segment: "#0F4A36",
      onSegment: "#FFFFFF",
      badgeBg: "#E8F5EE",
      badgeText: "#1A6B4E",
      badgeBorder: "#C4E4D2",
    },
  },
};

export function stageMultiplier(company: PortfolioCompany): number {
  if (!company.stage_base_rate) return 1;
  return company.survival_pct / company.stage_base_rate;
}

export function formatMultiplier(m: number): string {
  if (m >= 1) return `${m.toFixed(1)}×`;
  return `${m.toFixed(2)}×`;
}
