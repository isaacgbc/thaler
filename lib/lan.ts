// LAN V4 Applications dataset loader.
// Source: data/startups.json produced by parser from .analysis/output/*.md

import raw from "@/data/startups.json";

export type Tier =
  | "STRONG_ACCEPT"
  | "ACCEPT"
  | "BORDERLINE"
  | "REJECT"
  | "PRE_APPROVED"
  | "PENDING";

export type DataConfidence = "HIGH" | "LOW" | "NONE";

export interface Traction {
  mrr: number | null;
  arr: number | null;
  users: number | null;
  clients: number | null;
  note: string;
}

export interface LanStartup {
  slug: string;
  name: string;
  country: string;
  countries: string[];
  category: string;
  tier: Tier;
  rank: number | null;
  survivalPct: number | null;
  lanFit: number | null;
  moatScore: number | null;
  founders: string[];
  stage: string;
  traction: Traction;
  summary: string;
  strengths: string[];
  risks: string[];
  redFlags: string[];
  tailwinds: string[];
  verdict: string;
  recommendation: string;
  thalerPath: string;
  fullReport: string;
  dataConfidence: DataConfidence;
  updatedAt: string;
}

export const STARTUPS: LanStartup[] = (raw as LanStartup[]).map((s) => ({
  ...s,
  dataConfidence: s.dataConfidence ?? "HIGH",
}));

export const BY_SLUG = new Map(STARTUPS.map((s) => [s.slug, s]));

export function getStartup(slug: string): LanStartup | undefined {
  return BY_SLUG.get(slug);
}

export const COUNTRY_NAMES: Record<string, { name: string; flag: string }> = {
  PY: { name: "Paraguay", flag: "🇵🇾" },
  AR: { name: "Argentina", flag: "🇦🇷" },
  BR: { name: "Brasil", flag: "🇧🇷" },
  CL: { name: "Chile", flag: "🇨🇱" },
  UY: { name: "Uruguay", flag: "🇺🇾" },
  MX: { name: "México", flag: "🇲🇽" },
  CO: { name: "Colombia", flag: "🇨🇴" },
  PE: { name: "Perú", flag: "🇵🇪" },
  BO: { name: "Bolivia", flag: "🇧🇴" },
  US: { name: "USA", flag: "🇺🇸" },
};

export const TIER_LABEL: Record<Tier, string> = {
  STRONG_ACCEPT: "Strong Accept",
  ACCEPT: "Accept",
  BORDERLINE: "Borderline",
  REJECT: "Reject",
  PRE_APPROVED: "Pre-approved",
  PENDING: "Pending",
};

export const TIER_ORDER: Tier[] = [
  "STRONG_ACCEPT",
  "ACCEPT",
  "BORDERLINE",
  "PRE_APPROVED",
  "PENDING",
  "REJECT",
];

export function tierColor(tier: Tier): {
  bg: string;
  text: string;
  border: string;
} {
  switch (tier) {
    case "STRONG_ACCEPT":
      return {
        bg: "bg-positive-light",
        text: "text-cyan",
        border: "border-cyan/30",
      };
    case "ACCEPT":
      return {
        bg: "bg-positive-light/60",
        text: "text-cyan-dim",
        border: "border-cyan/20",
      };
    case "BORDERLINE":
      return {
        bg: "bg-warning-light",
        text: "text-warning-dim",
        border: "border-warning/30",
      };
    case "REJECT":
      return {
        bg: "bg-danger-light",
        text: "text-danger-dim",
        border: "border-danger/30",
      };
    case "PRE_APPROVED":
      return {
        bg: "bg-theory-light",
        text: "text-theory-dim",
        border: "border-theory/30",
      };
    case "PENDING":
    default:
      return {
        bg: "bg-bg-elevated",
        text: "text-text-secondary",
        border: "border-border-subtle",
      };
  }
}

export function categoryLabel(cat: string): string {
  const map: Record<string, string> = {
    fintech: "Fintech",
    climate: "Climate",
    "enterprise-ai": "Enterprise AI",
    saas: "SaaS",
    compliance: "Compliance",
    biotech: "Biotech",
    edtech: "Edtech",
    agtech: "Agtech",
    payments: "Payments",
    "hr-tech": "HR Tech",
    "legal-tech": "Legal Tech",
    cybersecurity: "Cybersecurity",
    "dev-tools": "Dev Tools",
    pending: "Pending",
  };
  return map[cat] ?? cat;
}

export function allCountries(): string[] {
  const set = new Set<string>();
  for (const s of STARTUPS) {
    for (const c of s.countries ?? [s.country]) set.add(c);
  }
  return Array.from(set).sort();
}

export function allCategories(): string[] {
  return Array.from(new Set(STARTUPS.map((s) => s.category))).sort();
}

export function paraguayPool(): LanStartup[] {
  return STARTUPS.filter(
    (s) =>
      (s.country === "PY" || (s.countries ?? []).includes("PY")) &&
      s.tier !== "REJECT"
  );
}
