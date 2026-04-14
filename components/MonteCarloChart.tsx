"use client";

import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Label,
} from "recharts";
import type { MonteCarloResult } from "@/lib/types";

interface Props {
  data: Array<{ bin_label: string; count: number }>;
  scenarios?: MonteCarloResult["scenarios"];
}

// Gaussian-ish smoother: take a rolling 3-bin average. Not statistically exact
// but gives a clean curve overlay on top of the histogram bars.
function smooth(data: Array<{ bin_label: string; count: number }>) {
  return data.map((d, i, arr) => {
    const a = arr[i - 1]?.count ?? d.count;
    const b = d.count;
    const c = arr[i + 1]?.count ?? d.count;
    return { ...d, smoothed: (a + 2 * b + c) / 4 };
  });
}

// Heuristic: map a scenario survival_pct (0-100) onto an x-position in the
// histogram. We assume bin_labels are ordered low→high on the x-axis.
function scenarioBinIndex(
  data: Array<{ bin_label: string; count: number }>,
  pct: number
): number {
  if (!data.length) return 0;
  // Try to parse "X-Y%" style labels and locate the bin containing pct.
  const match = (label: string, value: number) => {
    const m = label.match(/(-?\d+)/g);
    if (!m) return false;
    if (m.length === 1) {
      return Math.abs(Number(m[0]) - value) < 5;
    }
    const lo = Number(m[0]);
    const hi = Number(m[1]);
    return value >= lo && value <= hi;
  };
  const hit = data.findIndex((d) => match(d.bin_label, pct));
  if (hit >= 0) return hit;
  // Fallback: position proportionally
  return Math.min(
    data.length - 1,
    Math.max(0, Math.round((pct / 100) * (data.length - 1)))
  );
}

export function MonteCarloChart({ data, scenarios }: Props) {
  if (!data?.length) {
    return (
      <div className="h-64 flex items-center justify-center text-text-muted font-sans text-[13px]">
        No histogram data
      </div>
    );
  }

  const dataset = smooth(data);

  const lines = scenarios
    ? [
        {
          key: "tailwind",
          label: "Best case",
          pct: scenarios.tailwind?.survival_pct,
          color: "var(--positive)",
        },
        {
          key: "base",
          label: "Base",
          pct: scenarios.base?.survival_pct,
          color: "var(--cyan)",
        },
        {
          key: "headwind",
          label: "Worst",
          pct: scenarios.headwind?.survival_pct,
          color: "var(--warning)",
        },
        {
          key: "storm",
          label: "Crisis",
          pct: scenarios.storm?.survival_pct,
          color: "var(--danger)",
        },
      ].filter((l) => typeof l.pct === "number")
    : [];

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={dataset}
          margin={{ top: 30, right: 24, left: 0, bottom: 40 }}
        >
          <defs>
            <linearGradient id="thaler-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--cyan)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--cyan)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border-subtle)"
            vertical={false}
          />
          <XAxis
            dataKey="bin_label"
            stroke="var(--border-subtle)"
            tick={{
              fill: "var(--text-muted)",
              fontFamily: "var(--font-sans)",
              fontSize: 11,
            }}
            tickMargin={8}
            interval={0}
            angle={-30}
            textAnchor="end"
            height={52}
          />
          <YAxis
            stroke="var(--border-subtle)"
            tick={{
              fill: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
            }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            cursor={{ fill: "var(--bg-elevated)" }}
            contentStyle={{
              backgroundColor: "var(--bg-elevated)",
              border: "1px solid var(--border-active)",
              borderRadius: 2,
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              color: "var(--text-primary)",
            }}
            labelStyle={{ color: "var(--text-muted)", fontSize: 12 }}
          />
          <Bar dataKey="count" fill="var(--cyan)" fillOpacity={0.45} radius={[1, 1, 0, 0]} />
          <Area
            type="monotone"
            dataKey="smoothed"
            stroke="var(--cyan)"
            strokeWidth={2}
            fill="url(#thaler-area)"
            isAnimationActive
            animationDuration={800}
            dot={false}
          />
          {lines.map((l) => {
            const idx = scenarioBinIndex(data, l.pct as number);
            const x = data[idx]?.bin_label;
            if (!x) return null;
            return (
              <ReferenceLine
                key={l.key}
                x={x}
                stroke={l.color}
                strokeDasharray="4 3"
                strokeWidth={1.25}
              >
                <Label
                  value={l.label}
                  position="top"
                  fill={l.color}
                  fontSize={11}
                  fontFamily="var(--font-sans)"
                />
              </ReferenceLine>
            );
          })}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
