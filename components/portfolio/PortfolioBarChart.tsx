"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  LabelList,
  Customized,
} from "recharts";
import type { PortfolioCompany } from "@/lib/portfolio";

interface Props {
  companies: PortfolioCompany[];
  height?: number;
}

interface Row {
  company: string;
  survival: number;
  baseRate: number;
  stage: string;
  category: "legacy" | "recent";
}

// Custom renderer: per-row vertical tick at each company's stage base rate.
function BaseRateTicks(props: any) {
  const { xAxisMap, yAxisMap, data } = props;
  const xAxis = xAxisMap?.[0];
  const yAxis = yAxisMap?.[0];
  if (!xAxis || !yAxis || !data) return null;

  const rows: Row[] = data;

  return (
    <g pointerEvents="none">
      {rows.map((row, i) => {
        const x = xAxis.scale(row.baseRate);
        const yCategory = yAxis.scale(row.company);
        if (
          typeof x !== "number" ||
          Number.isNaN(x) ||
          typeof yCategory !== "number"
        )
          return null;
        const bandwidth = yAxis.scale.bandwidth ? yAxis.scale.bandwidth() : 20;
        const y1 = yCategory - bandwidth / 2 + 4;
        const y2 = yCategory + bandwidth / 2 - 4;
        return (
          <g key={`tick-${row.company}-${i}`}>
            <line
              x1={x}
              x2={x}
              y1={y1}
              y2={y2}
              stroke="#1A1A1A"
              strokeWidth={2}
            />
          </g>
        );
      })}
    </g>
  );
}

export function PortfolioBarChart({ companies, height = 420 }: Props) {
  const data: Row[] = [...companies]
    .sort((a, b) => b.survival_pct - a.survival_pct)
    .map((c) => ({
      company: c.company,
      survival: c.survival_pct,
      baseRate: c.stage_base_rate,
      stage: c.stage_at_investment,
      category: c.category,
    }));

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 56, bottom: 8, left: 8 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border-subtle)"
            horizontal={false}
          />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{
              fill: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
            }}
            axisLine={{ stroke: "var(--border-subtle)" }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="company"
            width={110}
            tick={{
              fill: "var(--text-secondary)",
              fontFamily: "var(--font-sans)",
              fontSize: 12,
            }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
            contentStyle={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-active)",
              borderRadius: 2,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
            }}
            labelStyle={{ color: "var(--text-primary)", fontWeight: 500 }}
            formatter={(v: number, name: string, entry: any) => {
              const row: Row = entry?.payload;
              if (!row) return [`${v}%`, name];
              const mult = (row.survival / row.baseRate).toFixed(1);
              return [
                `${v}% · ${mult}× vs ${row.baseRate}% ${row.stage} base`,
                "Thaler score",
              ];
            }}
          />
          <Bar dataKey="survival" radius={[0, 1, 1, 0]} isAnimationActive={false}>
            {data.map((d) => (
              <Cell
                key={d.company}
                fill={d.category === "legacy" ? "#B8B5AD" : "#1A6B4E"}
              />
            ))}
            <LabelList
              dataKey="survival"
              position="right"
              formatter={(v: number | string) => `${v}%`}
              style={{
                fill: "var(--text-secondary)",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
              }}
            />
          </Bar>
          <Customized component={BaseRateTicks} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
