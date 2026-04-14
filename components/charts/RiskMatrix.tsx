"use client";

import {
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
  ReferenceArea,
  CartesianGrid,
  Tooltip,
  Label,
} from "recharts";

export interface MatrixPoint {
  label: string;
  probability: number; // 0-100
  impact: number; // 0-100
  kind: "risk" | "opportunity";
}

export function RiskMatrix({ points }: { points: MatrixPoint[] }) {
  const risks = points.filter((p) => p.kind === "risk");
  const opps = points.filter((p) => p.kind === "opportunity");

  return (
    <div className="w-full" style={{ height: 440 }}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 180, left: 16, bottom: 36 }}>
          <CartesianGrid stroke="var(--border-subtle)" strokeDasharray="3 3" />
          {/* Quadrant shading */}
          <ReferenceArea
            x1={50}
            x2={100}
            y1={50}
            y2={100}
            fill="var(--cyan)"
            fillOpacity={0.04}
          />
          <ReferenceArea
            x1={0}
            x2={50}
            y1={0}
            y2={50}
            fill="var(--text-muted)"
            fillOpacity={0.04}
          />
          <XAxis
            type="number"
            dataKey="probability"
            domain={[0, 100]}
            stroke="var(--border-subtle)"
            tick={{
              fill: "var(--text-muted)",
              fontFamily: "var(--font-sans)",
              fontSize: 12,
            }}
          >
            <Label
              value="Probability →"
              position="insideBottom"
              offset={-20}
              fill="var(--text-secondary)"
              style={{ fontFamily: "var(--font-sans)", fontSize: 13 }}
            />
          </XAxis>
          <YAxis
            type="number"
            dataKey="impact"
            domain={[0, 100]}
            stroke="var(--border-subtle)"
            tick={{
              fill: "var(--text-muted)",
              fontFamily: "var(--font-sans)",
              fontSize: 12,
            }}
          >
            <Label
              value="Impact →"
              angle={-90}
              position="insideLeft"
              fill="var(--text-secondary)"
              style={{ fontFamily: "var(--font-sans)", fontSize: 13 }}
            />
          </YAxis>
          <ZAxis range={[110, 110]} />
          <Tooltip
            cursor={{ stroke: "var(--border-active)" }}
            contentStyle={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-active)",
              borderRadius: 2,
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              color: "var(--text-primary)",
            }}
            formatter={(value: any, _name: any, item: any) => {
              const p = item?.payload as MatrixPoint | undefined;
              if (!p) return value;
              return [
                `Prob ${p.probability}% · Impact ${p.impact}%`,
                p.label,
              ];
            }}
          />
          <Scatter
            name="Risks"
            data={risks}
            fill="var(--danger)"
            shape={(props: any) => {
              const { cx, cy, payload } = props;
              return (
                <g>
                  <title>{payload.label}</title>
                  <circle cx={cx} cy={cy} r={7} fill="var(--danger)" opacity={0.92} />
                  <text
                    x={cx + 12}
                    y={cy + 4}
                    fill="var(--text-body)"
                    fontFamily="var(--font-sans)"
                    fontSize={12}
                  >
                    {truncate(payload.label, 30)}
                  </text>
                </g>
              );
            }}
          />
          <Scatter
            name="Opportunities"
            data={opps}
            fill="var(--positive)"
            shape={(props: any) => {
              const { cx, cy, payload } = props;
              return (
                <g>
                  <title>{payload.label}</title>
                  <circle cx={cx} cy={cy} r={7} fill="var(--positive)" opacity={0.92} />
                  <text
                    x={cx + 12}
                    y={cy + 4}
                    fill="var(--text-body)"
                    fontFamily="var(--font-sans)"
                    fontSize={12}
                  >
                    {truncate(payload.label, 30)}
                  </text>
                </g>
              );
            }}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

function truncate(s: string, n: number): string {
  if (!s) return "";
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}
