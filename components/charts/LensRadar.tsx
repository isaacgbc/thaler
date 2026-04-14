"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import type { StressReport } from "@/lib/types";

// Map each agent's result to a 0-100 score for radar visualization.
function lensScores(report: StressReport): Array<{ lens: string; score: number }> {
  const r: any = report.results;
  const out: Array<{ lens: string; score: number }> = [];

  const macro = r.macro;
  const macroScore = macro
    ? macro.outlook === "favorable"
      ? 85
      : macro.outlook === "cautious"
      ? 65
      : macro.outlook === "challenging"
      ? 40
      : macro.outlook === "hostile"
      ? 20
      : 50
    : 0;
  out.push({ lens: "Macro", score: macroScore });

  const demand = r.demand;
  const demandScore = demand
    ? demand.demand_level === "validated"
      ? 85
      : demand.demand_level === "probable"
      ? 65
      : demand.demand_level === "uncertain"
      ? 40
      : demand.demand_level === "weak"
      ? 20
      : 50
    : 0;
  out.push({ lens: "Demand", score: demandScore });

  out.push({ lens: "Moat", score: r.moat?.moat_score ?? 0 });

  const sales = r.sales;
  const ltvCac = sales?.metrics?.ltv_cac_ratio ?? 0;
  // Map 0..5× to 0..100 (3× = healthy threshold → 60)
  const salesScore = Math.min(100, Math.round((ltvCac / 5) * 100));
  out.push({ lens: "Sales", score: salesScore });

  const behavioral = r.behavioral;
  // Behavioral score comes from clamped modifier normalised to 0..100
  const behavioralMod = behavioral?.survival_modifier ?? 0;
  out.push({
    lens: "Behavioral",
    score: Math.max(0, Math.min(100, 50 + behavioralMod * 2.5)),
  });

  const ai = r.ai_disruption;
  const aiRiskScore = ai
    ? ai.disruption_risk === "negligible"
      ? 90
      : ai.disruption_risk === "low"
      ? 75
      : ai.disruption_risk === "moderate"
      ? 50
      : ai.disruption_risk === "high"
      ? 25
      : ai.disruption_risk === "existential"
      ? 10
      : 50
    : 0;
  out.push({ lens: "AI resilience", score: aiRiskScore });

  const founder = r.founder;
  out.push({
    lens: "Founder",
    score: Math.max(0, Math.min(100, Math.round(founder?.score ?? 0))),
  });

  out.push({
    lens: "Simulation",
    score: Math.round(r.monte_carlo?.survival_rate_pct ?? 0),
  });

  return out;
}

export function LensRadar({ report }: { report: StressReport }) {
  const data = lensScores(report);

  return (
    <div className="w-full" style={{ height: 380 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="78%">
          <PolarGrid stroke="var(--border-subtle)" />
          <PolarAngleAxis
            dataKey="lens"
            tick={{
              fill: "var(--text-secondary)",
              fontFamily: "var(--font-sans)",
              fontSize: 13,
            }}
            tickSize={18}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{
              fill: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
            }}
            stroke="var(--border-subtle)"
            axisLine={false}
          />
          <Radar
            dataKey="score"
            stroke="var(--cyan)"
            strokeWidth={2}
            fill="var(--cyan)"
            fillOpacity={0.15}
            isAnimationActive
            animationDuration={900}
            dot={{ r: 4, fill: "var(--cyan)", stroke: "var(--bg-void)", strokeWidth: 2 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
