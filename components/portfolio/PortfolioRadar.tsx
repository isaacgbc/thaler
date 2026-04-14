"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { SCORE_LABELS, type PortfolioCompany } from "@/lib/portfolio";

interface Props {
  companies: PortfolioCompany[];
  height?: number;
  showLegend?: boolean;
  variant?: "single" | "overlay";
}

// Consulting-palette series colors. Kept stable per-company so that filter
// toggles don't cause a palette reshuffle. Deep forest green is the primary
// brand accent; supporting tones are muted, warm, and chart-safe on white.
const PALETTE: Record<string, string> = {
  Nubank: "#1A6B4E",
  Kavak: "#C4372A",
  NotCo: "#5B4A9E",
  QuintoAndar: "#2F5C8E",
  Creditas: "#B5850A",
  Azos: "#0E7490",
  Humand: "#1A6B4E",
  Pomelo: "#1E3A8A",
  Arvo: "#134E3A",
  Niva: "#6B21A8",
};

export function PortfolioRadar({
  companies,
  height = 420,
  showLegend = true,
  variant = "overlay",
}: Props) {
  const data = SCORE_LABELS.map(({ key, label }) => {
    const row: Record<string, string | number> = { lens: label };
    for (const c of companies) {
      row[c.company] = c.scores[key];
    }
    return row;
  });

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="#F0EFEB" />
          <PolarAngleAxis
            dataKey="lens"
            tick={{
              fill: "var(--text-secondary)",
              fontFamily: "var(--font-sans)",
              fontSize: 12,
            }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{
              fill: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
            }}
            stroke="#F0EFEB"
            axisLine={false}
          />
          {companies.map((c) => {
            const color = PALETTE[c.company] ?? "var(--cyan)";
            const fillOpacity = variant === "single" ? 0.1 : 0.06;
            return (
              <Radar
                key={c.company}
                name={c.company}
                dataKey={c.company}
                stroke={color}
                strokeWidth={variant === "single" ? 2 : 1.5}
                fill={color}
                fillOpacity={fillOpacity}
                isAnimationActive
                animationDuration={700}
              />
            );
          })}
          <Tooltip
            contentStyle={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-active)",
              borderRadius: 3,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
            labelStyle={{ color: "var(--text-primary)", fontWeight: 500 }}
            itemStyle={{ color: "var(--text-body)" }}
          />
          {showLegend && (
            <Legend
              wrapperStyle={{
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                paddingTop: 12,
                color: "var(--text-secondary)",
              }}
              iconType="circle"
              iconSize={8}
            />
          )}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export { PALETTE as PORTFOLIO_PALETTE };
